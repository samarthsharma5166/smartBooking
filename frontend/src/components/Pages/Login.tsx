// import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Lock, Mail, User } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helper/axiosInstance";
// import Swal from 'sweetalert2/dist/sweetalert2.js'
import Swal from 'sweetalert2'
import axios from "axios";

import 'sweetalert2/src/sweetalert2.scss'

interface Inputs {
  email: string,
  password: string
}

function Login() {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (data.email === "" || data.password === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "All fields are required!🚦",
        });
      }
      const res = await axiosInstance.post("/doctor/login", data)
      console.log(res)
      if (res.data.success) {
        console.log(res.data)
        localStorage.setItem("isLoggedIn", JSON.stringify(res.data.success))
        navigate("/admin/dashboard");
      } else {
        alert(res.data.message)
      }

    } catch (error: unknown) {
      console.log(error)
      if (axios.isAxiosError<{ message: string }>(error)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }

    }
  }


  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1737505191929-7cd64f65d2d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGNhbG0lMjBibHVlJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcwOTkwNjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-teal-50/85 to-cyan-50/90 backdrop-blur-sm"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-600">
              Psychology Practice Management System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-gray-700">
                  Email Address
                </FieldLabel>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@clinic.com"
                    {...register("email")}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200 focus:border-teal-400 focus:ring-teal-400/20 transition-all"
                    required
                  />
                </div>
                <FieldDescription className="text-gray-600">
                  Use your administrative email address
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="text-gray-700">
                  Password
                </FieldLabel>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200 focus:border-teal-400 focus:ring-teal-400/20 transition-all"
                    required
                  />
                </div>
                <FieldDescription className="text-gray-600">
                  Enter your secure password
                </FieldDescription>
              </Field>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Field>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6"
                >
                  Sign In
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-sm text-gray-600">
              Protected by end-to-end encryption
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need assistance?{" "}
            <a
              href="#"
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;