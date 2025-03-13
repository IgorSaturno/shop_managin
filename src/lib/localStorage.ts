import { Product } from "@/types/Product";

type ProductValidation = {
  isValid: boolean;
  sanitizedProduct?: Product;
};

const DEFAULT_PRODUCT: Omit<Product, "id"> = {
  name: "Produto sem nome",
  price: 0,
  stock: 0,
  category: "Sem categoria",
  subBrand: "Sem marca",
  description: "",
  imageUrl: "https://via.placeholder.com/150",
  images: [],
  status: "Disponível",
  createdAt: new Date().toISOString(),
};

// Função de validação reutilizável
const validateProduct = (rawProduct: any): ProductValidation => {
  try {
    const baseProduct = {
      ...DEFAULT_PRODUCT,
      ...rawProduct,
      createdAt: rawProduct.createdAt || new Date().toISOString(),
      id: rawProduct.id || generateId(),
    };

    const sanitized: Product = {
      id: String(baseProduct.id),
      name: String(baseProduct.name).trim() || DEFAULT_PRODUCT.name,
      price: Math.max(0, Number(baseProduct.price)) || DEFAULT_PRODUCT.price,
      stock: Math.max(0, Number(baseProduct.stock)) || DEFAULT_PRODUCT.stock,
      category: String(baseProduct.category).trim() || DEFAULT_PRODUCT.category,
      subBrand: String(baseProduct.subBrand).trim() || DEFAULT_PRODUCT.subBrand,
      description: String(baseProduct.description).trim(),
      imageUrl: String(baseProduct.imageUrl).trim() || DEFAULT_PRODUCT.imageUrl,
      images: Array.isArray(baseProduct.images)
        ? baseProduct.images
            .map((img: any) => String(img).trim())
            .filter(Boolean)
        : DEFAULT_PRODUCT.images,
      status: ["Disponível", "Indisponível"].includes(baseProduct.status)
        ? baseProduct.status
        : DEFAULT_PRODUCT.status,
      createdAt: String(baseProduct.createdAt), // Garantir que é string
    };

    return {
      isValid: true,
      sanitizedProduct: sanitized,
    };
  } catch (error) {
    console.error("Erro na validação do produto:", error);
    return { isValid: false };
  }
};

// Função para gerar ID mais robusta
const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`.padEnd(15, "0").slice(0, 15);
};

// Operações CRUD para Produtos
export const getProducts = (): Product[] => {
  try {
    const storedData = localStorage.getItem("products");
    if (!storedData) return [];

    const parsed: unknown = JSON.parse(storedData);
    if (!Array.isArray(parsed)) return [];

    return parsed.reduce((acc: Product[], rawProduct: unknown) => {
      const validation = validateProduct(rawProduct);
      return validation.isValid ? [...acc, validation.sanitizedProduct!] : acc;
    }, []);
  } catch (error) {
    console.error("Erro crítico ao carregar produtos, resetando...");
    localStorage.setItem("products", JSON.stringify([]));
    return [];
  }
};

export const saveProduct = (product: Product): void => {
  try {
    const products = getProducts();
    const validation = validateProduct(product);

    if (!validation.isValid) {
      throw new Error("Produto inválido");
    }

    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = validation.sanitizedProduct!;
    } else {
      products.push(validation.sanitizedProduct!);
    }

    localStorage.setItem("products", JSON.stringify(products));
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    throw new Error("Falha ao salvar produto");
  }
};

export const removeProduct = (id: string): void => {
  const products = getProducts().filter((product) => product.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
};

// Operações para Categorias
const validateCategory = (category: string): string | null => {
  const cleaned = String(category).trim();
  return cleaned.length >= 2 && cleaned.length <= 50 ? cleaned : null;
};

export const getCategories = (): string[] => {
  try {
    const stored = localStorage.getItem("categories");
    const parsed: unknown[] = stored ? JSON.parse(stored) : [];
    return parsed
      .map((c) => validateCategory(String(c)))
      .filter((c): c is string => c !== null)
      .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicatas
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    return [];
  }
};

export const saveCategory = (category: string): void => {
  try {
    const validated = validateCategory(category);
    if (!validated) return;

    const categories = getCategories();
    if (!categories.includes(validated)) {
      localStorage.setItem(
        "categories",
        JSON.stringify([...categories, validated])
      );
    }
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    throw new Error("Falha ao salvar categoria");
  }
};

// Operações para SubMarcas (mesma lógica das categorias)
const validateSubBrand = validateCategory; // Reutiliza a mesma validação

export const getSubBrands = (): string[] => {
  try {
    const stored = localStorage.getItem("subBrands");
    const parsed: unknown[] = stored ? JSON.parse(stored) : [];
    return parsed
      .map((sb) => validateSubBrand(String(sb)))
      .filter((sb): sb is string => sb !== null)
      .filter((v, i, a) => a.indexOf(v) === i);
  } catch (error) {
    console.error("Erro ao carregar submarcas:", error);
    return [];
  }
};

export const saveSubBrand = (subBrand: string): void => {
  try {
    const validated = validateSubBrand(subBrand);
    if (!validated) return;

    const subBrands = getSubBrands();
    if (!subBrands.includes(validated)) {
      localStorage.setItem(
        "subBrands",
        JSON.stringify([...subBrands, validated])
      );
    }
  } catch (error) {
    console.error("Erro ao salvar submarca:", error);
    throw new Error("Falha ao salvar submarca");
  }
};

// Funções de manutenção
export const backupLocalStorage = (): Record<string, unknown> => {
  return {
    products: getProducts(),
    categories: getCategories(),
    subBrands: getSubBrands(),
  };
};

export const restoreLocalStorage = (backup: Record<string, unknown>): void => {
  try {
    if (backup.products) {
      const products = Array.isArray(backup.products)
        ? backup.products
            .map((p) => validateProduct(p).sanitizedProduct)
            .filter(Boolean)
        : [];
      localStorage.setItem("products", JSON.stringify(products));
    }

    if (backup.categories) {
      const categories = Array.isArray(backup.categories)
        ? backup.categories
            .map((c) => validateCategory(String(c)))
            .filter(Boolean)
        : [];
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    if (backup.subBrands) {
      const subBrands = Array.isArray(backup.subBrands)
        ? backup.subBrands
            .map((sb) => validateSubBrand(String(sb)))
            .filter(Boolean)
        : [];
      localStorage.setItem("subBrands", JSON.stringify(subBrands));
    }
  } catch (error) {
    console.error("Erro ao restaurar backup:", error);
    throw new Error("Falha na restauração");
  }
};

export const resetStorage = (): void => {
  localStorage.clear();
};

export const updateProduct = (updatedProduct: Product): void => {
  try {
    const products = getProducts();

    // Validação do produto atualizado
    const validation = validateProduct(updatedProduct);
    if (!validation.isValid || !validation.sanitizedProduct) {
      throw new Error("Produto inválido para atualização");
    }

    const index = products.findIndex((p) => p.id === updatedProduct.id);

    if (index === -1) {
      throw new Error("Produto não encontrado para atualização");
    }

    const newProducts = [...products];
    newProducts[index] = validation.sanitizedProduct;

    localStorage.setItem("products", JSON.stringify(newProducts));
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw new Error("Falha ao atualizar produto");
  }
};
