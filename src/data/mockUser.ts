import type { User } from "@/types";

export const mockUser: User = {
  id: "usr_001",
  name: "Maria Clara Santos",
  email: "maria.santos@email.com",
  phone: "(11) 98765-4321",
  cpf: "123.456.789-00",
  rg: "12.345.678-9",
  address: {
    street: "Rua das Margaridas",
    number: "450",
    complement: "Apto 12B",
    neighborhood: "Jardim Botânico",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
  },
  avatarUrl: undefined,
};
