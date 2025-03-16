export interface Product {
  id: string;
  name: string;
  price: number; // Garantir que seja sempre number
  stock: number;
  category: string;
  subBrand: string;
  description: string;
  imageUrl: string;
  images: string[];
  status: "Disponível" | "Indisponível";
  createdAt: string;
  tags: string[];
}
