import {
  makeFilePublic,
  makeFilePrivate,
} from "../src/lib/actions/mutation/documents";
import { pinata } from "../src/lib/pinata-config";

// // Mock pinata config
// jest.mock("../src/lib/pinata-config", () => ({
//   pinata: {
//     upload: {
//       private: {
//         url: jest.fn(),
//       },
//       public: {
//         url: jest.fn(),
//       },
//     },
//     files: {
//       public: {
//         delete: jest.fn(),
//       },
//       private: {
//         delete: jest.fn(),
//       },
//     },
//   },
// }));

describe("Documents Server Functions", () => {
  // Real case test examples dengan parameter asli
  describe("Real Case Examples", () => {
    it("should test makeFilePublic with real-like parameters", async () => {
      // Arrange - contoh parameter yang mirip dengan real case
      const realParams = {
        id: "0198c7fa-c95d-795a-93c7-eed59856eddf",
        docId: "bismillah",
        url: "https://blush-hidden-anglerfish-733.mypinata.cloud/ipfs/bafkreiev2vhqfgtjbhhd5m4ncfjr3usvc4jkr7yq7bjszha4a6a3zttkv4",
      };

      // Act
      const result = await makeFilePublic(realParams);

      // Assert
      expect(result.isSuccess).toBe(true);
    });

    it("should test makeFilePrivate with real-like parameters", async () => {
      // Arrange - contoh parameter yang mirip dengan real case
      const realParams = {
        id: "0198c7fa-c95d-795a-93c7-eed59856eddf",
        docId: "bismillah",
        url: "https://blush-hidden-anglerfish-733.mypinata.cloud/ipfs/bafkreiev2vhqfgtjbhhd5m4ncfjr3usvc4jkr7yq7bjszha4a6a3zttkv4",
      };

      // Act
      const result = await makeFilePrivate(realParams);

      // Assert
      expect(result.isSuccess).toBe(true);
    });
  });
});
