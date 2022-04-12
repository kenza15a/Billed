/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES } from "../constants/routes";

// describe("Given I am connected as an employee", () => {
//   Object.defineProperty(window, "localStorage", {
//     value: localStorageMock,
//   });
//   window.localStorage.setItem(
//     "user",
//     JSON.stringify({
//       type: "Employee",
//     })
//   );
//   const html = BillsUI({ data: bills });
//   document.body.innerHTML = html;
//   const onNavigate = (Bills) => {
//     document.body.innerHTML = ROUTES({ Bills });
//   };

//   describe("When I am on Bills Page", () => {
//     test("Then bill icon in vertical layout should be highlighted", () => {
//       //to-do write expect expression
//       expect(screen.getByTestId("icon-window"))
//         .classList.contains("active-icon")
//         .toBe(true);
//     });

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      //to-do write expect expression
      // on vérifie le highlight ennprenant en compte la différence des couleurs
      const icone1bg = $("#layout-icon1").css("background-color");
      const layout1bg = $(".vertical-navbar").css("background-color");
      expect(icone1bg === layout1bg).toBeFalsy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});
