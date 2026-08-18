import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const expectedCatalog = `
1|Camisa|8000
2|Camiseta|8000
3|Pantalón|9000
4|Jeans|9000
5|Vestido Hombre 2 Pzs.|17000
6|Corbata|4000
7|Corbata Cortesía|0
8|Chaqueta Sencilla|11000
9|Chaqueta Acolchada|12000
10|Chaqueta Moto|16000
11|Chaqueta De Plumas|16000
12|Chaqueta De Cuerina|17000
13|Gaban|13000
14|Abrigo|15000
15|Blazer|11000
16|Suéter|10000
17|Buso|10000
18|Chaleco Sencillo|10000
19|Chaleco Plumas|15000
20|Blusa|8000
21|Falda|9000
22|Jardinera|11000
23|Bata Dama|15000
24|Vestido Dama 2 Pzs.|17000
25|Enterizo|13000
26|Sudadera|18000
27|Chal|10000
28|Bufanda|8000
29|Ruana|17000
30|Bermuda|9000
31|Botas|16000
32|Tenis|16000
33|Gorra|7000
34|Bolso Dama|16000
35|Mortal|18000
36|Maleta Viaje|18000
37|Overol|16000
38|Almohada Sencilla|13000
39|Almohada De Plumas|16000
40|Edredón Sencillo|25000
41|Edredón Doble|30000
42|Edredón Queen|32000
43|Edredón Plumas Sencillo|38000
44|Edredón Plumas Doble|40000
45|Edredón Plumas Queen|42000
46|Duvet|20000
47|Juego Sábanas|18000
48|Cobija Sencilla|23000
49|Cobija Doble|26000
50|Hamaca|20000
51|Cojín Relleno|10000
52|Mantel|12000
53|Toalla|40000
54|Cortina Velo Metro|8000
55|Cortina Pesada Metro|8000
56|Tapete Mt Cuadrado|38000
57|Muñeco|20000
58|Vestido Novia|35000
59|Vestido Quinceañera|35000
60|Vestido Fiesta Corto|13000
61|Vestido Fiesta Largo|16000
62|Vestido Primera Comunión|35000
63|Tintura Prenda|28000
64|Solo Plancha|6000
65|Forros De Carro Unidad|40000
66|Bolsa De Lavado|45000
67|Boxer|5000
68|Par Medias|5000
69|Sotana|18000
70|Forro De Silla|40000
71|Togas|15000
72|Birretes|5000
73|Abrigo Corto|11000
74|Colcha Sencilla|25000
75|Protector De Colchón Sencillo|20000
76|Protector De Colchón Doble|22000
77|Buso Capota|11000
78|Suéter|10000
79|Colcha|26000
80|Edredón Sencillo|26000
81|Chaleco Traje|8000
82|Servicio Extra|5000
83|Vestido Tres Piezas Hombre|25000
84|Vestido Tres Piezas Niño|17000
85|Protector Colchón|20000
86|Protector Sofa|23000
87|Prenda Niño|7000
88|Bata Laboratorio|12000
89|Prendas Navidad|12000
90|Pantalón Sintético|15000
91|Protector Colchón|18000
92|Buso|11000
93|Hamaca|18000
94|Colchoneta Bebé|24000
95|Cama De Mascota|25000
96|Servicio Extra|5000
97|Otra Prenda|0
99|Media Bolsa Lavado|30000
100|Edredón Ovejero|32000
101|Tintura Chaqueta|28000
102|Tintura Pantalón|28000
103|Edredón Cama Doble|32000
104|Tintura Pantalón|28000
`.trim().split("\n").map((line) => {
  const [id, name, price] = line.split("|");
  return { id: Number(id), name, price: Number(price) };
});

describe("catálogo de servicios de Lavanderia Innovation", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
  const catalogBlock = source.match(/const initialServices = \[(.*?)\n\];/s)?.[1] ?? "";
  const records = [...catalogBlock.matchAll(/\{ id: (\d+), name: "([^"]+)", description: "[^"]+", price: (\d+), active: true \}/g)].map((match) => ({
    id: Number(match[1]),
    name: match[2],
    price: Number(match[3]),
  }));

  it("coincide exactamente con el listado entregado y excluye el código 98", () => {
    expect(records).toEqual(expectedCatalog);
    expect(records.some((record) => record.id === 98)).toBe(false);
  });
});
