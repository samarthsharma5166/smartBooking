// // import React, { useEffect, useState } from "react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import axiosInstance from "@/helper/axiosInstance";
// // import { formatTime, timeToMinutes } from "@/helper/helper";
// // import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// // import { Check, Clock, Loader2, User } from "lucide-react";
// // import { format } from "date-fns";
// // const Appointments = () => {
// //   const [appointments, setAppointments] = useState([]);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isEdit, setIsEdit] = useState(false);
// //   const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
// //   const [sessionTypes, setSessionTypes] = useState([]);
// //   const [formData, setFormData] = useState({
// //     id: "",
// //     date: "",
// //     startTime: "",
// //     email:"",
// //     // whatsapp:",
// //     endTime: "",
// //     sessionTypeId: "",
// //     // userId: "",
// //     // doctorId: "",
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [loadingSlots, setLoadingSlots] = useState(false);

// //   useEffect(() => {
// //     const fetchSessionTypes = async () => {
// //       try {
// //         const response = await axiosInstance.get(
// //           `/session-types`
// //         );
// //         setSessionTypes(response.data.data.sessionTypes);
// //       } catch (error) {
// //         console.error("Error fetching session types:", error);
// //       }
// //     };
// //     fetchSessionTypes();
// //   }, []);

// //   useEffect(() => {
// //     fetchAppointments();
// //   }, []);

// //   const fetchAppointments = async () => {
// //     try {
// //       const response = await axiosInstance.get(
// //         `/bookings/appointments`
// //       );
// //       setAppointments(response.data.data);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching appointments:", error);
// //       setLoading(false);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { id, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [id]: value }));
// //   };
// //   const updateFormData = (field: keyof FormData, value: any) =>
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   const handleSubmit = async () => {
// //     if (!formData.date ) {
// //       alert("Please fill in all required fields.");
// //       return;
// //     }
// //     // const sTime = JSON.stringify(timeToMinutes(formData.startTime));
// //     // const eTime = JSON.stringify(timeToMinutes(formData.endTime));

// //     // setFormData((prev) => ({ ...prev, startTime: sTime, endTime: eTime }));
// //     try {
// //       if (isEdit) {
// //         await axiosInstance.patch(`/bookings/appointments/${formData.id}`, formData);
// //       } else {
// //         const { name, email, whatsapp, date, sessionTypeId, timeSlot } = formData;
// //         const res = await axiosInstance.post("/bookings/appointments", {
// //             name, email, whatsapp,
// //             date: format(date, "yyyy-MM-dd"),
// //             startTime: timeSlot.start,
// //             endTime: timeSlot.end,
// //             sessionTypeId,
// //         });
// //       }
// //       fetchAppointments();
// //       setIsOpen(false);
// //       setIsEdit(false);
// //       resetFormData();
// //     } catch (error) { 

// //       console.error("Error saving appointment:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (!formData.date || !formData.sessionTypeId) return;
// //     const fetchSlots = async () => {
// //       setLoadingSlots(true);
// //       setAvailableSlots([]);
// //       setFormData((prev) => ({ ...prev, timeSlot: "" }));
// //       try {
// //         const dateString = format(formData.date!, "yyyy-MM-dd");
// //         const response = await axiosInstance.get(
// //           `/bookings/slots?date=${dateString}&sessionTypeId=${formData.sessionTypeId}`
// //         );
// //         setAvailableSlots(response.data);
// //       } catch (error: any) {
// //         alert(error.response?.data?.message ?? "Failed to load slots.");
// //       } finally {
// //         setLoadingSlots(false);
// //       }
// //     };
// //     fetchSlots();
// //   }, [formData.date, formData.sessionTypeId]);

// //   const handleEdit = (appointment) => {
// //     setFormData({
// //       id: appointment.id,
// //       date: new Date(appointment.date).toISOString().split('T')[0],
// //       startTime: appointment.startTime,
// //       endTime: appointment.endTime,
// //       sessionTypeId: appointment.sessionTypeId,
// //       // userId: appointment.userId,
// //       // doctorId: appointment.doctorId,
// //     });
// //     setIsEdit(true);
// //     setIsOpen(true);
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await axiosInstance.delete(`/bookings/appointments/${id}`);
// //       fetchAppointments();
// //     } catch (error) {
// //       console.error("Error deleting appointment:", error);
// //     }
// //   };

// //   const resetFormData = () => {
// //     setFormData({
// //       id: "",
// //       date: "",
// //       startTime: "",
// //       endTime: "",
// //       sessionTypeId: "",
// //       // userId: "",
// //       // doctorId: "",
// //     });
// //   };

// //   return (
// //     <div className="p-4">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-2xl font-bold">Appointments</h1>
// //         <Dialog open={isOpen} onOpenChange={setIsOpen}>
// //           <DialogTrigger asChild>
// //             <Button onClick={() => { setIsEdit(false); resetFormData(); setIsOpen(true); }}>
// //               Add Appointment
// //             </Button>
// //           </DialogTrigger>
// //           <DialogContent>
// //             <DialogHeader>
// //               <DialogTitle>{isEdit ? "Edit Appointment" : "Add Appointment"}</DialogTitle>
// //             </DialogHeader>
// //             <div className="grid gap-4 py-4">
// //               <div className="grid grid-cols-4 items-center gap-4">
// //                 <Label htmlFor="date" className="text-right">
// //                   Date
// //                 </Label>
// //                 <Input
// //                   id="date"
// //                   type="date"
// //                   value={formData.date}
// //                   onChange={handleInputChange}
// //                   className="col-span-3"
// //                 />
// //               </div>
// //               <div className="grid grid-cols-4 items-center gap-4">
// //                 {/* <Label htmlFor="startTime" className="text-right">
// //                   Start Time
// //                 </Label>
// //                 <Input
// //                   id="startTime"
// //                   type="time"
// //                   value={formData.startTime}
// //                   onChange={handleInputChange}
// //                   className="col-span-3"
// //                 /> */}
// //                 <Label htmlFor="startTime" className="text-right">
// //                   Email
// //                 </Label>
// //                 <Input
// //                   id="email"
// //                   type="text"
// //                   value={formData.email}
// //                   onChange={handleInputChange}
// //                   className="col-span-3"
// //                 />
// //               </div>
// //               <div className="grid grid-cols-4 items-center gap-4">
// //                 {/* <Label htmlFor="endTime" className="text-right">
// //                   End Time
// //                 </Label>
// //                 <Input
// //                   id="endTime"
// //                   type="time"
// //                   value={formData.endTime}
// //                   onChange={handleInputChange}
// //                   className="col-span-3"
// //                 /> */}

// //                 {formData.date && (
// //                   <div>
// //                     <div className="flex items-center gap-2 mb-3">
// //                       <Clock className="w-4 h-4 text-teal-600" />
// //                       <span className="text-sm font-semibold text-slate-700">Available Slots</span>
// //                     </div>

// //                     {loadingSlots ? (
// //                       <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
// //                         <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
// //                         <span className="text-xs">Fetching available slots…</span>
// //                       </div>
// //                     ) : availableSlots.length === 0 ? (
// //                       <div className="flex flex-col items-center justify-center py-8 gap-2">
// //                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
// //                           <Clock className="w-5 h-5 text-slate-400" />
// //                         </div>
// //                         <p className="text-sm font-medium text-slate-600">No slots available</p>
// //                         <p className="text-xs text-slate-400">Try selecting a different date</p>
// //                       </div>
// //                     ) : (
// //                       <div
// //                         className="grid grid-cols-3 sm:grid-cols-4 gap-2"
// //                         role="listbox"
// //                         aria-label="Available time slots"
// //                       >
// //                         {availableSlots.map((slot, idx) => {
// //                           const selected = formData.timeSlot === slot;
// //                           return (
// //                             <button
// //                               key={idx}
// //                               role="option"
// //                               aria-selected={selected}
// //                               tabIndex={0}
// //                               onClick={() => updateFormData("timeSlot", slot)}
// //                               onKeyDown={(e) => {
// //                                 if (e.key === "Enter" || e.key === " ") {
// //                                   e.preventDefault();
// //                                   updateFormData("timeSlot", slot);
// //                                 }
// //                               }}
// //                               className={`
// //                                                                     h-[52px] rounded-lg text-xs font-semibold
// //                                                                     border transition-all duration-150
// //                                                                     flex flex-col items-center justify-center gap-0.5
// //                                                                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
// //                                                                     ${selected
// //                                   ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200 scale-[1.04]"
// //                                   : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/60"
// //                                 }
// //                                                                 `}
// //                             >
// //                               <span>{formatTime(slot.start)}</span>
// //                               <span className={`text-[10px] font-normal ${selected ? "text-teal-100" : "text-slate-400"}`}>
// //                                 – {formatTime(slot.end)}
// //                               </span>
// //                             </button>
// //                           );
// //                         })}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //               <div className="grid grid-cols-4 items-center gap-4">
// //                 <Label htmlFor="sessionTypeId" className="text-right">
// //                   Session Type ID
// //                 </Label>
// //                 <p className="text-sm text-slate-500">
// //                   Choose the type of session that best fits your needs.
// //                 </p>
// //                 <RadioGroup
// //                   value={formData.sessionTypeId}
// //                   onValueChange={(v) => updateFormData("sessionTypeId", v)}
// //                   className="space-y-3"
// //                   aria-label="Session type"
// //                 >
// //                   {sessionTypes.map((sessionType) => {
// //                     const active = formData.sessionTypeId === sessionType.id;
// //                     return (
// //                       <Label
// //                         key={sessionType.id}
// //                         htmlFor={sessionType.id}
// //                         className={`
// //                                                         group block rounded-xl border p-4 cursor-pointer
// //                                                         transition-all duration-200
// //                                                         ${active
// //                             ? "border-teal-500 bg-teal-50/60 shadow-sm"
// //                             : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
// //                           }
// //                                                     `}
// //                       >
// //                         <div className="flex items-start gap-3">
// //                           <RadioGroupItem
// //                             value={sessionType.id}
// //                             id={sessionType.id}
// //                             className="mt-0.5 border-slate-300 text-teal-600"
// //                           />
// //                           <div className={`
// //                                                             w-10 h-10 rounded-xl flex items-center justify-center shrink-0
// //                                                             transition-colors duration-200
// //                                                             ${active
// //                               ? "bg-teal-100 text-teal-600"
// //                               : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
// //                             }
// //                                                         `}>
// //                             <User className="w-5 h-5" />
// //                           </div>
// //                           <div className="flex-1 min-w-0">
// //                             <div className={`font-semibold text-sm ${active ? "text-teal-700" : "text-slate-800"}`}>
// //                               {sessionType.title}
// //                             </div>
// //                             <div className="text-xs text-slate-500 mt-0.5">{sessionType.sub}</div>
// //                             <div className={`text-xs mt-1 font-bold ${active ? "text-teal-600" : "text-slate-500"}`}>
// //                               ₹{sessionType.fee}
// //                             </div>
// //                             <div className={`text-[11px] mt-1 ${active ? "text-teal-600" : "text-slate-400"}`}>
// //                               {sessionType.note}
// //                             </div>
// //                           </div>
// //                           {active && (
// //                             <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
// //                               <Check className="w-3 h-3 text-white" />
// //                             </div>
// //                           )}
// //                         </div>
// //                       </Label>
// //                     );
// //                   })}
// //                 </RadioGroup>
// //               </div>
// //               {/* <div className="grid grid-cols-4 items-center gap-4">
// //                 <Label htmlFor="userId" className="text-right">
// //                   User ID
// //                 </Label>
// //                 <Input
// //                   id="userId"
// //                   value={formData.userId}
// //                   onChange={handleInputChange}
// //                   className="col-span-3"
// //                 />
// //               </div>
// //               <div className="grid grid-cols-4 items-center gap-4">
// //                 <Label htmlFor="doctorId" className="text-right">
// //                   Doctor ID
// //                 </Label>
// //                 <Input
// //                   id="doctorId"
// //                   value={formData.doctorId}
// //                   onChange={handleInputChange}
// //                   className="col-span-3"
// //                 />
// //               </div> */}
// //             </div>
// //             <DialogFooter>
// //               <Button onClick={handleSubmit}>Save</Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>Date</TableHead>
// //               <TableHead>Start Time</TableHead>
// //               <TableHead>End Time</TableHead>
// //               <TableHead>Session Type</TableHead>
// //               <TableHead>User</TableHead>
// //               <TableHead>Doctor</TableHead>
// //               <TableHead>Actions</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {appointments.map((appointment) => (
// //               <TableRow key={appointment.id}>
// //                 <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
// //                 <TableCell>{formatTime(parseInt(appointment.startTime)) }</TableCell>
// //                 <TableCell>{formatTime(parseInt(appointment.endTime))}</TableCell>
// //                 <TableCell>{appointment.sessionTypeId}</TableCell>
// //                 <TableCell>{appointment.userId}</TableCell>
// //                 <TableCell>{appointment.doctorId}</TableCell>
// //                 <TableCell>
// //                   <Button variant="outline" onClick={() => handleEdit(appointment)}>
// //                     Edit
// //                   </Button>
// //                   <Button
// //                     variant="destructive"
// //                     onClick={() => handleDelete(appointment.id)}
// //                     className="ml-2"
// //                   >
// //                     Delete
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       )}
// //     </div>
// //   );
// // };

// // export default Appointments;


// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import axiosInstance from "@/helper/axiosInstance";
// import { formatTime, timeToMinutes } from "@/helper/helper";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { Check, Clock, Loader2, User, Calendar as CalendarIcon, Plus, Edit, Trash2, CalendarDays } from "lucide-react";
// import { format } from "date-fns";

// type Slot = {
//   start: number;
//   end: number;
// };

// type FormData = {
//   id: string;
//   date: string | Date;
//   startTime: string;
//   email: string;
//   whatsapp?: string;
//   name?: string;
//   endTime: string;
//   sessionTypeId: string;
//   timeSlot?: Slot | string;
// };

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
//   const [sessionTypes, setSessionTypes] = useState([]);
//   const [formData, setFormData] = useState<FormData>({
//     id: "",
//     date: "",
//     startTime: "",
//     email: "",
//     endTime: "",
//     sessionTypeId: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [loadingSlots, setLoadingSlots] = useState(false);

//   useEffect(() => {
//     const fetchSessionTypes = async () => {
//       try {
//         const response = await axiosInstance.get(
//           `/session-types`
//         );
//         setSessionTypes(response.data.data.sessionTypes);
//       } catch (error) {
//         console.error("Error fetching session types:", error);
//       }
//     };
//     fetchSessionTypes();
//   }, []);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `/bookings/appointments`
//       );
//       setAppointments(response.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       setLoading(false);
//     }
//   };

//   console.log(appointments)

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const updateFormData = (field: keyof FormData, value: any) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const handleSubmit = async () => {
//     if (!formData.date) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     try {
//       if (isEdit) {
//         await axiosInstance.patch(`/bookings/appointments/${formData.id}`, formData);
//       } else {
//         const { name, email, whatsapp, date, sessionTypeId, timeSlot } = formData;
//         // Handle date as string from input
//         const dateString = typeof date === 'string' ? date : format(date, "yyyy-MM-dd");
//         const res = await axiosInstance.post("/bookings/appointments", {
//           name,
//           email,
//           whatsapp,
//           date: dateString,
//           startTime: (timeSlot as Slot).start,
//           endTime: (timeSlot as Slot).end,
//           sessionTypeId,
//         });
//       }
//       fetchAppointments();
//       setIsOpen(false);
//       setIsEdit(false);
//       resetFormData();
//     } catch (error) {
//       console.error("Error saving appointment:", error);
//     }
//   };

//   useEffect(() => {
//     if (!formData.date || !formData.sessionTypeId) return;
//     const fetchSlots = async () => {
//       setLoadingSlots(true);
//       setAvailableSlots([]);
//       setFormData((prev) => ({ ...prev, timeSlot: "" }));
//       try {
//         // Handle date as string from input
//         const dateString = typeof formData.date === 'string'
//           ? formData.date
//           : format(formData.date, "yyyy-MM-dd");
//         const response = await axiosInstance.get(
//           `/bookings/slots?date=${dateString}&sessionTypeId=${formData.sessionTypeId}`
//         );
//         setAvailableSlots(response.data);
//       } catch (error: any) {
//         alert(error.response?.data?.message ?? "Failed to load slots.");
//       } finally {
//         setLoadingSlots(false);
//       }
//     };
//     fetchSlots();
//   }, [formData.date, formData.sessionTypeId]);

//   const handleEdit = (appointment: any) => {
//     setFormData({
//       id: appointment.id,
//       date: new Date(appointment.date).toISOString().split("T")[0],
//       startTime: appointment.startTime,
//       endTime: appointment.endTime,
//       sessionTypeId: appointment.sessionTypeId,
//       email: "",
//     });
//     setIsEdit(true);
//     setIsOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await axiosInstance.delete(`/bookings/appointments/${id}`);
//       fetchAppointments();
//     } catch (error) {
//       console.error("Error deleting appointment:", error);
//     }
//   };

//   const resetFormData = () => {
//     setFormData({
//       id: "",
//       date: "",
//       startTime: "",
//       endTime: "",
//       sessionTypeId: "",
//       email: "",
//     });
//   };

//   return (
//     <div className="min-h-screen p-5 lg:p-7">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
//         <div className="flex items-start gap-4">
//           {/* Icon badge */}
//           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-200 shrink-0">
//             <CalendarDays className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-900 leading-tight">
//               Appointments
//             </h1>
//             <p className="text-sm text-slate-500 mt-0.5">
//               Manage and schedule patient appointments
//             </p>
//           </div>
//         </div>

//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//           <DialogTrigger asChild>
//             <Button
//               onClick={() => {
//                 setIsEdit(false);
//                 resetFormData();
//                 setIsOpen(true);
//               }}
//               className="
//                 gap-2 bg-teal-500 hover:bg-teal-600 text-white
//                 rounded-xl px-5 h-10 text-sm font-semibold
//                 shadow-md shadow-teal-200 hover:shadow-teal-300
//                 transition-all duration-150
//               "
//             >
//               <Plus className="w-4 h-4" />
//               Add Appointment
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
//             <DialogHeader>
//               <DialogTitle className="text-lg font-bold text-slate-900">
//                 {isEdit ? "Edit Appointment" : "Add Appointment"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-5 py-4">
//               {/* Date Input */}
//               <div className="space-y-2">
//                 <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
//                   Date
//                 </Label>
//                 <Input
//                   id="date"
//                   type="date"
//                   value={formData.date as string}
//                   onChange={handleInputChange}
//                   className="h-10 rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:border-teal-400"
//                 />
//               </div>

//               {/* Email Input */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   type="text"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="h-10 rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:border-teal-400"
//                   placeholder="patient@example.com"
//                 />
//               </div>

//               {/* Session Type Selection */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-slate-700">
//                   Session Type
//                 </Label>
//                 <p className="text-xs text-slate-500">
//                   Choose the type of session that best fits your needs.
//                 </p>
//                 <RadioGroup
//                   value={formData.sessionTypeId}
//                   onValueChange={(v) => updateFormData("sessionTypeId", v)}
//                   className="space-y-3"
//                   aria-label="Session type"
//                 >
//                   {sessionTypes.map((sessionType: any) => {
//                     const active = formData.sessionTypeId === sessionType.id;
//                     return (
//                       <Label
//                         key={sessionType.id}
//                         htmlFor={sessionType.id}
//                         className={`
//                           group block rounded-xl border p-4 cursor-pointer
//                           transition-all duration-200
//                           ${active
//                             ? "border-teal-500 bg-teal-50/60 shadow-sm"
//                             : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
//                           }
//                         `}
//                       >
//                         <div className="flex items-start gap-3">
//                           <RadioGroupItem
//                             value={sessionType.id}
//                             id={sessionType.id}
//                             className="mt-0.5 border-slate-300 text-teal-600"
//                           />
//                           <div
//                             className={`
//                               w-10 h-10 rounded-xl flex items-center justify-center shrink-0
//                               transition-colors duration-200
//                               ${active
//                                 ? "bg-teal-100 text-teal-600"
//                                 : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
//                               }
//                             `}
//                           >
//                             <User className="w-5 h-5" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div
//                               className={`font-semibold text-sm ${active ? "text-teal-700" : "text-slate-800"
//                                 }`}
//                             >
//                               {sessionType.title}
//                             </div>
//                             <div className="text-xs text-slate-500 mt-0.5">
//                               {sessionType.sub}
//                             </div>
//                             <div
//                               className={`text-xs mt-1 font-bold ${active ? "text-teal-600" : "text-slate-500"
//                                 }`}
//                             >
//                               ₹{sessionType.fee}
//                             </div>
//                             <div
//                               className={`text-[11px] mt-1 ${active ? "text-teal-600" : "text-slate-400"
//                                 }`}
//                             >
//                               {sessionType.note}
//                             </div>
//                           </div>
//                           {active && (
//                             <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
//                               <Check className="w-3 h-3 text-white" />
//                             </div>
//                           )}
//                         </div>
//                       </Label>
//                     );
//                   })}
//                 </RadioGroup>
//               </div>

//               {/* Available Slots */}
//               {formData.date && formData.sessionTypeId && (
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-teal-600" />
//                     <span className="text-sm font-semibold text-slate-700">
//                       Available Slots
//                     </span>
//                   </div>

//                   {loadingSlots ? (
//                     <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
//                       <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
//                       <span className="text-xs">Fetching available slots…</span>
//                     </div>
//                   ) : availableSlots.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-8 gap-2">
//                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
//                         <Clock className="w-5 h-5 text-slate-400" />
//                       </div>
//                       <p className="text-sm font-medium text-slate-600">
//                         No slots available
//                       </p>
//                       <p className="text-xs text-slate-400">
//                         Try selecting a different date
//                       </p>
//                     </div>
//                   ) : (
//                     <div
//                       className="grid grid-cols-3 sm:grid-cols-4 gap-2"
//                       role="listbox"
//                       aria-label="Available time slots"
//                     >
//                       {availableSlots.map((slot, idx) => {
//                         const selected = formData.timeSlot === slot;
//                         return (
//                           <button
//                             key={idx}
//                             role="option"
//                             aria-selected={selected}
//                             tabIndex={0}
//                             onClick={() => updateFormData("timeSlot", slot)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" || e.key === " ") {
//                                 e.preventDefault();
//                                 updateFormData("timeSlot", slot);
//                               }
//                             }}
//                             className={`
//                               h-[52px] rounded-lg text-xs font-semibold
//                               border transition-all duration-150
//                               flex flex-col items-center justify-center gap-0.5
//                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
//                               ${selected
//                                 ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200 scale-[1.04]"
//                                 : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/60"
//                               }
//                             `}
//                           >
//                             <span>{formatTime(slot.start)}</span>
//                             <span
//                               className={`text-[10px] font-normal ${selected ? "text-teal-100" : "text-slate-400"
//                                 }`}
//                             >
//                               – {formatTime(slot.end)}
//                             </span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//             <DialogFooter>
//               <Button
//                 onClick={handleSubmit}
//                 className="
//                   gap-2 bg-teal-500 hover:bg-teal-600 text-white
//                   rounded-lg px-5 h-9 text-sm font-semibold
//                   shadow shadow-teal-200
//                   transition-all duration-150
//                 "
//               >
//                 <Check className="w-4 h-4" />
//                 Save
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Appointments Table Card */}
//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-y-scroll">
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-slate-50/50 border-b border-slate-100">
//                 <TableHead className="font-semibold text-slate-700">Date</TableHead>
//                 <TableHead className="font-semibold text-slate-700">Start Time</TableHead>
//                 <TableHead className="font-semibold text-slate-700">End Time</TableHead>
//                 <TableHead className="font-semibold text-slate-700">Session Type</TableHead>
//                 <TableHead className="font-semibold text-slate-700">User</TableHead>
//                 <TableHead className="font-semibold text-slate-700">Doctor</TableHead>
//                 {/* <TableHead className="font-semibold text-slate-700">Actions</TableHead> */}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {appointments.map((appointment: any) => (
//                 <TableRow
//                   key={appointment.id}
//                   className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
//                 >
//                   <TableCell className="text-slate-700">
//                     {new Date(appointment.date).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell className="text-slate-700">
//                     {formatTime(parseInt(appointment.startTime))}
//                   </TableCell>
//                   <TableCell className="text-slate-700">
//                     {formatTime(parseInt(appointment.endTime))}
//                   </TableCell>
//                   <TableCell className="text-slate-700">
//                     {appointment.sessionTypeId}
//                   </TableCell>
//                   <TableCell className="text-slate-700">
//                     {appointment.userId}
//                   </TableCell>
//                   <TableCell className="text-slate-700">
//                     {appointment.doctorId}
//                   </TableCell>
//                   {/* <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(appointment)}
//                         className="h-8 px-3 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg"
//                       >
//                         <Edit className="w-3.5 h-3.5" />
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleDelete(appointment.id)}
//                         className="h-8 px-3 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                         Delete
//                       </Button>
//                     </div>
//                   </TableCell> */}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Appointments;


import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import axiosInstance from "@/helper/axiosInstance";
import { formatTime } from "@/helper/helper";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Check,
  Clock,
  Loader2,
  User,
  Plus,
  CalendarDays,
  Video,
  CreditCard,
  LayoutGrid,
  List,
  Stethoscope,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

type Slot = {
  start: number;
  end: number;
  isAvailable?: boolean;
};

type FormData = {
  id: string;
  date: string | Date;
  startTime: string;
  email: string;
  whatsapp?: string;
  name?: string;
  endTime: string;
  sessionTypeId: string;
  timeSlot?: Slot | string;
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
  },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  SUCCESS: { label: "Paid", color: "text-emerald-600" },
  PENDING: { label: "Pending", color: "text-amber-600" },
  FAILED: { label: "Failed", color: "text-rose-600" },
};

const AppointmentCard = ({ appointment }: { appointment: any }) => {
  const status = statusConfig[appointment.status] ?? statusConfig["CONFIRMED"];
  const payStatus = appointment.payment
    ? paymentStatusConfig[appointment.payment.status] ?? paymentStatusConfig["PENDING"]
    : null;

  const dateObj = new Date(appointment.date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-teal-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top color accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Date badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-teal-500 to-teal-600 flex flex-col items-center justify-center shadow-md shadow-teal-200 shrink-0">
              <span className="text-[10px] font-semibold text-teal-100 uppercase tracking-wider">{dayName}</span>
              <span className="text-xl font-bold text-white leading-none">{dayNum}</span>
              <span className="text-[10px] font-semibold text-teal-100 uppercase tracking-wider">{monthName}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                {formatTime(parseInt(appointment.startTime))}
                <span className="text-slate-400 font-normal">–</span>
                {formatTime(parseInt(appointment.endTime))}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {appointment.sessionType?.title ?? appointment.sessionTypeId}
              </div>
              {appointment.sessionType?.duration && (
                <div className="text-xs text-slate-400 mt-0.5">
                  {appointment.sessionType.duration} min session
                </div>
              )}
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* User & Doctor row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-violet-500" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Patient</div>
              <div className="text-xs font-semibold text-slate-700 truncate">
                {appointment.user?.name ?? "—"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {appointment.user?.email ?? appointment.userId}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 text-teal-600" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Doctor</div>
              <div className="text-xs font-semibold text-slate-700 truncate">
                {appointment.doctor?.name ?? "Assigned"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {appointment.doctorId?.slice(0, 8)}…
              </div>
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          {/* Payment */}
          {payStatus && (
            <div className="flex items-center gap-1.5">
              <CreditCard className={`w-3.5 h-3.5 ${payStatus.color}`} />
              <span className={`text-xs font-semibold ${payStatus.color}`}>
                {payStatus.label}
              </span>
              {appointment.payment?.amount && (
                <span className="text-xs text-slate-400">
                  · ₹{appointment.payment.amount.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Meet link */}
          {appointment.meetLink && (
            <a
              href={appointment.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-teal-200"
            >
              <Video className="w-3 h-3" />
              Join Meet
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [sessionTypes, setSessionTypes] = useState([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [formData, setFormData] = useState<FormData>({
    id: "",
    date: "",
    startTime: "",
    email: "",
    endTime: "",
    sessionTypeId: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchSessionTypes = async () => {
      try {
        const response = await axiosInstance.get(`/session-types`);
        setSessionTypes(response.data.data.sessionTypes);
      } catch (error) {
        console.error("Error fetching session types:", error);
      }
    };
    fetchSessionTypes();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get(`/bookings/appointments`);
      setAppointments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  console.log(appointments);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const updateFormData = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!formData.date) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      if (isEdit) {
        await axiosInstance.patch(`/bookings/appointments/${formData.id}`, formData);
      } else {
        const { name, email, whatsapp, date, sessionTypeId, timeSlot } = formData;
        const dateString = typeof date === "string" ? date : format(date, "yyyy-MM-dd");
        await axiosInstance.post("/bookings/appointments", {
          name,
          email,
          whatsapp,
          date: dateString,
          startTime: (timeSlot as Slot).start,
          endTime: (timeSlot as Slot).end,
          sessionTypeId,
        });
      }
      fetchAppointments();
      setIsOpen(false);
      setIsEdit(false);
      resetFormData();
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  useEffect(() => {
    if (!formData.date || !formData.sessionTypeId) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setFormData((prev) => ({ ...prev, timeSlot: "" }));
      try {
        const dateString =
          typeof formData.date === "string"
            ? formData.date
            : format(formData.date, "yyyy-MM-dd");
        const response = await axiosInstance.get(
          `/bookings/slots?date=${dateString}&sessionTypeId=${formData.sessionTypeId}`
        );
        setAvailableSlots(response.data);
      } catch (error: any) {
        alert(error.response?.data?.message ?? "Failed to load slots.");
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [formData.date, formData.sessionTypeId]);

  // const handleEdit = (appointment: any) => {
  //   setFormData({
  //     id: appointment.id,
  //     date: new Date(appointment.date).toISOString().split("T")[0],
  //     startTime: appointment.startTime,
  //     endTime: appointment.endTime,
  //     sessionTypeId: appointment.sessionTypeId,
  //     email: "",
  //   });
  //   setIsEdit(true);
  //   setIsOpen(true);
  // };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await axiosInstance.delete(`/bookings/appointments/${id}`);
  //     fetchAppointments();
  //   } catch (error) {
  //     console.error("Error deleting appointment:", error);
  //   }
  // };

  const resetFormData = () => {
    setFormData({
      id: "",
      date: "",
      startTime: "",
      endTime: "",
      sessionTypeId: "",
      email: "",
    });
  };

  // Stats
  const confirmed = appointments.filter((a: any) => a.status === "CONFIRMED").length;
  const today = appointments.filter((a: any) => {
    const d = new Date(a.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div className="min-h-screen p-5 lg:p-7 font-sans">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
            </div>
            <p className="text-sm text-slate-500 ml-[52px]">
              Manage and schedule patient sessions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "cards"
                  ? "bg-teal-500 text-white shadow"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "table"
                  ? "bg-teal-500 text-white shadow"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setIsEdit(false);
                    resetFormData();
                    setIsOpen(true);
                  }}
                  className="gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 h-10 text-sm font-semibold shadow-md shadow-teal-200 hover:shadow-teal-300 transition-all duration-150"
                >
                  <Plus className="w-4 h-4" />
                  Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    {isEdit ? "Edit Appointment" : "Add Appointment"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date as string}
                      onChange={handleInputChange}
                      className="h-10 rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:border-teal-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-10 rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:border-teal-400"
                      placeholder="patient@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Session Type</Label>
                    <p className="text-xs text-slate-500">
                      Choose the type of session that best fits your needs.
                    </p>
                    <RadioGroup
                      value={formData.sessionTypeId}
                      onValueChange={(v) => updateFormData("sessionTypeId", v)}
                      className="space-y-3"
                      aria-label="Session type"
                    >
                      {sessionTypes.map((sessionType: any) => {
                        const active = formData.sessionTypeId === sessionType.id;
                        return (
                          <Label
                            key={sessionType.id}
                            htmlFor={sessionType.id}
                            className={`group block rounded-xl border p-4 cursor-pointer transition-all duration-200 ${active
                              ? "border-teal-500 bg-teal-50/60 shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem
                                value={sessionType.id}
                                id={sessionType.id}
                                className="mt-0.5 border-slate-300 text-teal-600"
                              />
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${active
                                  ? "bg-teal-100 text-teal-600"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                  }`}
                              >
                                <User className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`font-semibold text-sm ${active ? "text-teal-700" : "text-slate-800"
                                    }`}
                                >
                                  {sessionType.title}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">{sessionType.sub}</div>
                                <div
                                  className={`text-xs mt-1 font-bold ${active ? "text-teal-600" : "text-slate-500"
                                    }`}
                                >
                                  ₹{sessionType.fee}
                                </div>
                                <div
                                  className={`text-[11px] mt-1 ${active ? "text-teal-600" : "text-slate-400"
                                    }`}
                                >
                                  {sessionType.note}
                                </div>
                              </div>
                              {active && (
                                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  {formData.date && formData.sessionTypeId && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-semibold text-slate-700">Available Slots</span>
                      </div>
                      {loadingSlots ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                          <span className="text-xs">Fetching available slots…</span>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">No slots available</p>
                          <p className="text-xs text-slate-400">Try selecting a different date</p>
                        </div>
                      ) : (
                        <div
                          className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                          role="listbox"
                          aria-label="Available time slots"
                        >
                          {availableSlots.map((slot, idx) => {
                            const selected = formData.timeSlot === slot;
                            return (
                              <button
                                key={idx}
                                role="option"
                                aria-selected={selected}
                                aria-disabled={!slot.isAvailable}
                                tabIndex={slot.isAvailable ? 0 : -1}
                                disabled={!slot.isAvailable}
                                onClick={() => {
                                  if (slot.isAvailable) {
                                    updateFormData("timeSlot", slot);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (slot.isAvailable && (e.key === "Enter" || e.key === " ")) {
                                    e.preventDefault();
                                    updateFormData("timeSlot", slot);
                                  }
                                }}
                                className={`h-[52px] rounded-lg text-xs font-semibold border transition-all duration-150 flex flex-col items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${!slot.isAvailable
                                  ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60 decoration-slate-400/50"
                                  : selected
                                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200 scale-[1.04]"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/60"
                                  }`}
                              >
                                <span className={!slot.isAvailable ? "line-through" : ""}>{formatTime(slot.start)}</span>
                                <span className={`text-[10px] font-normal ${!slot.isAvailable ? "line-through" : selected ? "text-teal-100" : "text-slate-400"}`}>
                                  – {formatTime(slot.end)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSubmit}
                    className="gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-5 h-9 text-sm font-semibold shadow shadow-teal-200 transition-all duration-150"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total",
              value: appointments.length,
              icon: <CalendarDays className="w-4 h-4" />,
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              label: "Confirmed",
              value: confirmed,
              icon: <Check className="w-4 h-4" />,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Today",
              value: today,
              icon: <Calendar className="w-4 h-4" />,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "With Meet",
              value: appointments.filter((a: any) => a.meetLink).length,
              icon: <Video className="w-4 h-4" />,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 leading-none">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            <span className="text-sm text-slate-500">Loading appointments…</span>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
            <CalendarDays className="w-8 h-8 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-slate-700">No appointments yet</p>
            <p className="text-sm text-slate-400 mt-1">Add your first appointment to get started</p>
          </div>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {appointments.map((appointment: any) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-b border-slate-100">
                <TableHead className="font-semibold text-slate-700">Date</TableHead>
                <TableHead className="font-semibold text-slate-700">Time</TableHead>
                <TableHead className="font-semibold text-slate-700">Session</TableHead>
                <TableHead className="font-semibold text-slate-700">Patient</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Payment</TableHead>
                <TableHead className="font-semibold text-slate-700">Meet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment: any) => {
                const status = statusConfig[appointment.status] ?? statusConfig["CONFIRMED"];
                const payStatus = appointment.payment
                  ? paymentStatusConfig[appointment.payment.status] ?? paymentStatusConfig["PENDING"]
                  : null;
                return (
                  <TableRow
                    key={appointment.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="text-slate-700 font-medium">
                      {new Date(appointment.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <span className="font-semibold">{formatTime(parseInt(appointment.startTime))}</span>
                      <span className="text-slate-400"> – </span>
                      {formatTime(parseInt(appointment.endTime))}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {appointment.sessionType?.title ?? appointment.sessionTypeId}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <div className="font-medium">{appointment.user?.name ?? "—"}</div>
                      <div className="text-xs text-slate-400">{appointment.user?.email ?? appointment.userId}</div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payStatus ? (
                        <span className={`text-sm font-semibold ${payStatus.color}`}>
                          {payStatus.label}
                          {appointment.payment?.amount && (
                            <span className="text-slate-400 font-normal"> · ₹{appointment.payment.amount.toLocaleString()}</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {appointment.meetLink ? (
                        <a
                          href={appointment.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition-colors border border-teal-200"
                        >
                          <Video className="w-3 h-3" />
                          Join
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Appointments;