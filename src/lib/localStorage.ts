import { Product } from "@/types/Product";

export const getProducts = (): Product[] => {
  const products = localStorage.getItem("products");
  return products ? JSON.parse(products) : [];
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
};

export const updateProduct = (updatedProduct: Product) => {
  const products = getProducts().map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product,
  );
  localStorage.setItem("products", JSON.stringify(products));
};

export const removeProduct = (id: string) => {
  const products = getProducts().filter((product) => product.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
};

export const getCategories = (): string[] => {
  const categories = localStorage.getItem("categories");
  return categories ? JSON.parse(categories) : [];
};

export const saveCategory = (category: string) => {
  const categories = getCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    localStorage.setItem("categories", JSON.stringify(categories));
  }
};

export const getSubBrands = (): string[] => {
  const subBrands = localStorage.getItem("subBrands");
  return subBrands ? JSON.parse(subBrands) : [];
};

export const saveSubBrand = (subBrand: string) => {
  const subBrands = getSubBrands();
  if (!subBrands.includes(subBrand)) {
    subBrands.push(subBrand);
    localStorage.setItem("subBrands", JSON.stringify(subBrands));
  }
};
