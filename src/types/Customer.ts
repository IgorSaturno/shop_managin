export interface Customer {
  id: string;
  name: string;
  email: string;
  adress: string;
  complement: string;
  numberofadress: number;
  phone: number;
  cep: number;
  purchases: number;
  status: "Ativo" | "Inativo";
}
