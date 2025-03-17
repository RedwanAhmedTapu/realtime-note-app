"use client";
import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const router=useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res=await login(email, password);
    console.log(res,"res")
    if(res){
        console.log(res)
        router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-800 to-slate-900">
    <div className="bg-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
      <h2 className="text-3xl font-bold text-center text-slate-200 mb-6">Login</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-800 text-slate-200 placeholder-slate-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-800 text-slate-200 placeholder-slate-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </form>
      <p className="text-center text-sm text-slate-400 mt-6">
        No account?{" "}
        <a
          href="/signup" // Replace with your signup route
          className="text-blue-400 hover:text-blue-300 hover:underline transition-all"
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
  );
};

export default Login;
