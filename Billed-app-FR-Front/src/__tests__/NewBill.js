/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";

import store from "../__mocks__/store.js";
import BillsUI from "../views/BillsUI.js";
import { ROUTES_PATH } from "../constants/routes";
import Router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      const user = JSON.stringify({
        type: "Employee",
        email: "a@a",
      });
      window.localStorage.setItem("user", user);

      const pathname = ROUTES_PATH["NewBill"];
      Object.defineProperty(window, "location", {
        value: {
          hash: pathname,
        },
      });

      document.body.innerHTML = `<div id="root"></div>`;
      Router();
    });
    it("should require the input type date", () => {
      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate).toBeRequired();
    });
    it("should require the input type number amount", () => {
      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount).toBeRequired();
    });
    it("should require the input type pct", () => {
      const inputPct = screen.getByTestId("pct");
      expect(inputPct).toBeRequired();
    });
    it("should require the input type file", () => {
      const inputfile = screen.getByTestId("file");
      expect(inputfile).toBeRequired();
    });
  });
});



// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I complete the requested fields and I submit", () => {
    // to avoid bomb for those who maintains the code
    afterEach(jest.clearAllMocks);
    it("should add a new bill to mock API POST", async () => {
      //jest.spyOn(object, methodName)
      const getSpyBills = jest.spyOn(store, "get");
      const billsData = await store.get();
      const bill = {
        id: "azerty3000",
        status: "pending",
        pct: 20,
        amount: 1500,
        email: "rogerleponey@openclassrooms.com",
        name: "Le Bon Paris",
        vat: "10",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2022-04-14",
        commentAdmin: "no comment",
        commentary: "postMockNewBill",
        type: "Restaurants et bars",
        fileUrl: "https://test-storage-billable.jpg",
      };
      //jest.spyOn(object, methodName)
      const getSpyAddBill = jest.spyOn(store, "post");
      const addedBill = await store.post(billsData, bill);

      expect(getSpyBills).toHaveBeenCalledTimes(1);
      expect(getSpyAddBill).toHaveBeenCalledTimes(1);
      expect(addedBill.data.length).toBe(5);
    });

    // same a bills.js
    it("should add a bill to API and fails with 404 message error", async () => {
      // écrase la fonction originale addedBill
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      // initialise le body
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    it("should add a bill to API and fails with 500 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      // initialise le body
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
