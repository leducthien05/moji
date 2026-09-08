import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";// Kết nối zod với react-hook-form;

import { z } from "zod";
import { useAuthStore} from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signInSchema = z.object({
    userName: z.string().min(1, "Tên đăng nhập bắt buộc phải có"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
});

// Khài báo kiểu cho form
type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
    const { signIn } = useAuthStore();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema)
    });

    const onSubmit = async (data: SignInFormValues) => {
        // Xử lý dữ liệu đăng nhập
        const { userName, password } = data;

        await signIn(userName, password);

        navigate("/");
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-border">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* Header- logo */}
                            <div className="flex flex-col items-center text-center gap-2">
                                <a
                                    href="/"
                                    className="mx-auto block w-fit text-center"
                                >
                                    <img
                                        src="/logo.svg"
                                        alt="logo"
                                    />
                                </a>
                                <h1 className="text-2xl font-bold">Tạo tài khoản Moji</h1>
                                <p className="text-muted-foreground text-balance">Chào mừng bạn! Hãy đăng ký để bắt đầu</p>
                            </div>

                            {/* userName */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="userName" className="">Tên đăng nhập</Label>
                                <Input
                                    type="text"
                                    id="userName"
                                    placeholder="moji"
                                    {...register("userName")}
                                ></Input>
                                {errors.userName && <p className="text-destructive text-sm">{errors.userName.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="password" className="">Mật khẩu</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    {...register("password")}
                                ></Input>
                                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                            </div>

                            {/* Nút đăng nhập */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                Đăng nhập
                            </Button>

                            <div className="text-center text-sm">
                                Chưa có tài khoản? {/**/}
                                <a
                                    href="/signup"
                                    className="underline underline-offset-4"
                                >
                                    Đăng ký
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/placeholderSignUp.png"
                            alt="Image"
                            className="absolute top-1/2 -translate-y-1/2 object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-xs text-balence px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline-offset-4">
                Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
                và <a href="#">Chính sách bảo mật của chúng tôi</a>.
            </div>
        </div>
    )
}
