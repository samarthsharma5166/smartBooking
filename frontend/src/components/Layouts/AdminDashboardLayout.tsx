import { Link, Outlet, useNavigate } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Users, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import axiosInstance from "@/helper/axiosInstance"
import { FaCalendarAlt, FaGoogle } from "react-icons/fa";
import { LuCalendarCheck2 } from "react-icons/lu";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import axios from "axios"

const MenuItem =
    [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: < Home className="mr-2 h-4 w-4" />
        },
        {
            title: "Avaliability",
            path: "/admin/avaliability",
            icon: <LuCalendarCheck2 className="mr-2 h-4 w-4" />
        },
        {
            title: "Session Types",
            path: "/admin/session-types",
            icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
            title: "Appointments",
            path: "/admin/appointments",
            icon: <FaCalendarAlt className="mr-2 h-4 w-4" />,
        }
    ]



const menuItemGroup2 =
    [
        {
            title: "Settings",
            path: "/admin/settings",
            icon: <Settings className="mr-2 h-4 w-4" />
        }
    ]



const AdminDashboardLayout = () => {
    const navigate = useNavigate();
    const [refrestTokenExist, setRefrestTokenExist] = useState(false);
    const getMe = async () => {
        try {
            const res = await axiosInstance.get("/doctor/me");
            const data = res.data;
            if (data.doctor.refreshToken === null) {
                setRefrestTokenExist(true);
            } else {
                setRefrestTokenExist(false);
            }
        } catch (error: unknown) {
            // alert(error.response.data.message)
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message);
            } else {
                alert("Something went wrong");
            }
        }
    }

    // function ConnectToGoogleCalendar() {
    //     window.location.href = "http://localhost:3000/api/v1/google/auth";
    // }
    function ConnectToGoogleCalendar() {
        window.location.href = "https://api.booking.inspiredliving.in/api/v1/google/auth";
    }
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("isLoggedIn")!);
        if (!token) {
            navigate("/11/22/33/44")
        }
        getMe();

    }, []);

    const LogOut = async () => {
        localStorage.removeItem("isLoggedIn");
        const res = await axiosInstance.get("/doctor/logout");
        Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500
        });
        navigate("/11/22/33/44");
    }
    return (
        <div className="flex min-h-screen">

            {refrestTokenExist && <div className="fixed top-0 left-0 flex items-center justify-center bg-black/20 w-full h-full z-99  backdrop-blur-3xl">
                <div className="sm:w-xl w-full h-24 bg-white absolute z-100 container shadow-2xl shadow-white rounded-lg flex items-center justify-center">
                    <Button onClick={ConnectToGoogleCalendar} size={"lg"} className="bg-black font-bold hover:bg-gray-700"> <FaGoogle /> Connect Your Google Calendar</Button>
                </div>
            </div>}
            <Sidebar collapsible="offcanvas">
                <SidebarHeader className="p-4 text-lg font-bold">
                    Admin Panel
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>General</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    MenuItem.map(item => (
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link to={item.path}>
                                                    {item.icon}
                                                    {item.title}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>

                        <SidebarGroupContent>
                            {
                                menuItemGroup2.map(item => (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.path}>
                                                {item.icon}
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-4 text-sm">
                    <Button onClick={LogOut}>Logout</Button>
                    © 2026 Admin
                </SidebarFooter>
            </Sidebar>

            <div className="flex-1 flex flex-col">

                {/* Top Navbar */}
                <header className="h-14 flex sm:hidden items-center border-b px-4 ">
                    <SidebarTrigger />
                    <span className="ml-4 font-semibold">Admin Dashboard</span>
                </header>

                <main className="flex-1 p-6 bg-background">
                    <Outlet />
                </main>
            </div>


        </div>
    )
}

export default AdminDashboardLayout