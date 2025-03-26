import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  // TODO: signup

  async function signUp(name) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          password: "super-secret-999",
        }),
      });
      const results = await response.json();
      setToken(results.token);
      setLocation("TABLET");
      // localStorage.setItem("token", results.token);
    } catch (e) {
      console.log(e.message);
    }
  }

  // TODO: authenticate

  async function authenticate() {
    if (!token) {
      throw Error("No token, bro");
    } else {
      try {
        const response = await fetch(API + "/authenticate", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response) {
          throw Error("Failed attempt, bro");
        } else {
          setLocation("TUNNEL");
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  const value = { location, signUp, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
