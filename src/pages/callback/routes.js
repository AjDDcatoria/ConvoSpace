import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient, CookieOptions } from "@supabase/supabase-js";

export default function AuthHandler() {
  const router = useRouter();
  const [code, setCode] = useState(null);

  useEffect(() => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const codeParam = params.get("code");
    const nextParam = params.get("next") || "/";

    if (codeParam) {
      setCode(codeParam);
    } else {
      router.push("/auth/auth-code-error");
    }
  }, []);

  useEffect(() => {
    if (code) {
      const supabase = createClient(
        import.meta.env.VITE_APP_SUPABASE_URL,
        import.meta.env.VITE_APP_SUPABASE_ANON_KEY,
        {
          cookieOptions: {
            get: (name) => document.cookie,
            set: (name, value, options) => {
              const cookieOptions = `${name}=${value}; ${options}`;
              document.cookie = cookieOptions;
            },
            remove: (name) => {
              document.cookie = `${name}=; Max-Age=0`;
            },
          },
        }
      );

      const exchangeCodeForSession = async () => {
        const { error } = await supabase.auth.api.exchangeCodeForSession(code, {
          redirectTo: `${window.location.origin}${nextParam}`,
        });
        if (!error) {
          window.location.href = `${window.location.origin}${nextParam}`;
        } else {
          router.push("/auth/auth-code-error");
        }
      };

      exchangeCodeForSession();
    }
  }, [code]);

  return null; // Render nothing, as this component handles authentication behind the scenes
}
