/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    it("should highlight the bill icon in vertical layout", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      //to-do write expect expression
      const icone1bg = $("#layout-icon1").css("background-color");
      const layout1bg = $(".vertical-navbar").css("background-color");
      expect(icone1bg === layout1bg).toBeFalsy();
      expect(icone1bg === layout1bg).not.toBeTruthy();
    });

    it("should be ordered the bills from earliest to latest", () => {
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
describe("Given I am connected as an employee", () => {
  describe("When I click on the showIcon : #icon-eye", () => {
    it("should open the modal window to view the image ", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const myBills = new Bills({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });
      const eye = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(myBills.handleClickIconEye(eye[0]));
      eye[0].addEventListener("click", handleClickIconEye);
      userEvent.click(eye[0]);
      expect(handleClickIconEye).toBeDefined();
      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = screen.getByTestId("modaleFileEmploee");
      expect(modale).toBeVisible();
    });
  });

  // UNIT TEST 2 BILLS
  describe("When I click on the button 'Nouvelle note de frais'", () => {
    it("should open a new page 'Envoyer une note de frais' ", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const myBills = new Bills({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });
      const button = screen.getByTestId("btn-new-bill");
      const handleClickNewBill = jest.fn(myBills.handleClickNewBill);
      button.addEventListener("click", handleClickNewBill);
      userEvent.click(button);
      expect(handleClickNewBill).toBeDefined();
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
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
