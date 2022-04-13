/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ROUTES_PATH, ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";
import { bills } from "../fixtures/bills.js";
import Router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    it("should  highlight the bill icon in vertical layout ", async () => {
      store.bills = () => ({ get: jest.fn().mockResolvedValue() });

      const user = JSON.stringify({ type: "Employee" });
      window.localStorage.setItem("user", user);

      const pathname = ROUTES_PATH["Bills"];
      Object.defineProperty(window, "location", {
        value: {
          hash: pathname,
        },
      });

      document.body.innerHTML = `<div id="root"></div>`;
      Router();

      const icon = screen.getByTestId("icon-window");
      expect(icon.classList.contains("active-icon")).toBeTruthy();
    });

    it("should show the loader before the tickets are displayed", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });

    it("should appear an error message if the tickets can't be displayed", () => {
      const html = BillsUI({ error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });

    it("should ordered the bills from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      console.log(datesSorted);
      expect(dates).toEqual(datesSorted);
    });
  });
});

// couvrir un maximum de  "statements" c'est simple, il faut qu’après avoir ajouté tes tests unitaires et d’intégration  le rapport de couverture du fichier container/Bills soit vert. Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".

// THANKIE to TESTING PLAYGROUND EXTENSION

// screen
// userEvent
// toHaveBeenCalled
// getByTestId
// toBeVisible
// toBeTruthy
// getByText

// UNIT TEST 1 BILLS
describe("When Im on a bill & I click on the icon eye", () => {
  test("Then A modal should open", () => {
    // set localstorage to mockstorage & user to employee
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    // place UI in DOM
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;

    // declare firestore
    const firestore = null;
    // define bills
    const billItem = new Bills({
      document,
      onNavigate,
      firestore,
      localStorage: window.localStorage,
    });
    // mock bootstrap modal function (see P9 sources folder)
    $.fn.modal = jest.fn();
    // mock methode handleClickIconEye
    const handleClickIconEye = jest.fn(billItem.handleClickIconEye);
    // find eye icon buttons in DOM
    const iconEye = screen.getAllByTestId("icon-eye");
    // add event listeners to eye icons
    iconEye.forEach((icon) => {
      icon.addEventListener("click", (e) => handleClickIconEye(icon));
      // mimic user interaction
      userEvent.click(icon);
    });
    // check methode is called
    expect(() => handleClickIconEye()).toThrow();
    expect(() => handleClickIconEye()).toThrow(Error);
    expect(handleClickIconEye).toHaveBeenCalled();
    // check Modal opened by searching for its ID
    const modale = document.getElementById("modaleFile");
    expect(modale).toBeTruthy();
  });
});

// UNIT TEST 2 BILLS
describe("When I click on New bill button", () => {
  test("Then It should renders NewBill page", () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    const user = JSON.stringify({
      type: "Employee",
    });
    window.localStorage.setItem("user", user);

    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const store = null;
    const billsClass = new Bills({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });

    const handleClickNewBill = jest.fn(billsClass.handleClickNewBill);
    const newBillButton = screen.getByTestId("btn-new-bill");
    newBillButton.addEventListener("click", handleClickNewBill);
    userEvent.click(newBillButton);
    expect(handleClickNewBill).toHaveBeenCalled();
    expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
  });
});

// GET INTEGRATION TEST IS COMING....

// https://youtu.be/7r4xVDI2vho   TRAVERSY MEDIA
// work with async data to GET data for Bills.js
// expect.assertions(nbr) ?
// beforeEach(() => {}); ?
// afterEach(() => {}); ?
// beforeAll()
// afterAll()

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(store, "get");
      const bills = await store.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("fetches bills from an API and fails with 404 message error", () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
