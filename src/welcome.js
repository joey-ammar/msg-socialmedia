import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

import ResetPassword from "./reset";
export default function Welcome() {
    return (
        <div id="welcome">
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route exact path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
