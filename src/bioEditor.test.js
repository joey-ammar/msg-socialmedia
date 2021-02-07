import React from "react";
import BioEditor from "./bioeditor";
import { render, waitForElement, fireEvent } from "@testing-library/react";
test("render add when no bio passed", async () => {
    const { container } = render(<BioEditor bio={null} />);
    await waitForElement(() => container.querySelector("div"));
    expect(container.querySelector("div").innerHTML).toBe(
        "You can add your bio now !"
    );
});
test("render edit when  bio passed", async () => {
    const { container } = render(<BioEditor bio="test2" />);
    await waitForElement(() => container.querySelector("div"));
    expect(container.querySelector("div").innerHTML).toBe(
        "Edit your information and render it"
    );
});
test("add or edit for textarea", () => {
    const myMockOnClick = jest.fn();
    const { container } = render(<BioEditor onClick={myMockOnClick} />);
    fireEvent.click(container.querySelector("button"));
    expect(container.getElementsByTagName("textarea").length).toBe(1);
    expect(container.getElementsByTagName("button")[0].innerHTML).toBe("Save");
});
