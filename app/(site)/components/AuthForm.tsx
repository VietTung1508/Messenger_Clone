"use client";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import Input from "@/app/components/input/input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Varient = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [varient, setVarient] = useState<Varient>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const toggleVarient = useCallback(() => {
    if (varient === "LOGIN") {
      setVarient("REGISTER");
    } else {
      setVarient("LOGIN");
    }
  }, [varient]);

  const onSubmt: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (varient === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch((e) => {
          toast.error("Some Thing Went Wrong");
        })
        .finally(() => setIsLoading(false));
    }

    if (varient === "LOGIN") {
      // NextAuth Signin
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid Credentials");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Logged In!");
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth Social SignIn

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
        }

        if (callback?.ok && callback?.error) {
          toast.success("Logged in!");
          router.push("/users");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md ">
      <div
        className="  bg-white
          py-7
          shadow
          sm:rounded-lg
          sm:px-10"
      >
        <form
          className="space-y-6  w-full  sm:rounded-lg "
          onSubmit={handleSubmit(onSubmt)}
        >
          {varient === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              type="text"
              errors={errors}
              disabled={isLoading}
            />
          )}

          <Input
            id="email"
            label="Email Address"
            register={register}
            type="text"
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            register={register}
            type="password"
            errors={errors}
            disabled={isLoading}
          />
          <Button fullWidth disabled={isLoading} type="submit">
            {varient === "LOGIN" ? "Sign In" : "Register"}
          </Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div
              className="absolute inset-0
          flex items-center"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {varient === "LOGIN"
              ? "New to Messenger"
              : "Already have a account"}
          </div>
          <div onClick={toggleVarient} className="underline cursor-pointer">
            {varient === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
