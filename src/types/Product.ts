export interface Product {
  id: string;
  name: string;
  category: string;
  subBrand: string;
  stock: number;
  price: number;
  description: string;
  status: "Disponível" | "Indisponível";
  imageUrl: string;
  images: string[];
}
