

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/helper/axiosInstance";
import {
  Plus,
  Clock,
  IndianRupee,
  Stethoscope,
  Edit2,
  Trash2,
  Layers,
  FileText,
  MessageSquare,
  Tag,
  Timer,
} from "lucide-react";

const SessionTypes = () => {
  const [sessionTypes, setSessionTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    duration: "",
    title: "",
    sub: "",
    note: "",
    fee: "",
  });

  useEffect(() => {
    fetchSessionTypes();
  }, []);

  const fetchSessionTypes = async () => {
    try {
      const response = await axiosInstance.get(`/session-types`);
      setSessionTypes(response.data.data.sessionTypes);
    } catch (error) {
      console.error("Error fetching session types:", error);
    }
  };

  console.log(sessionTypes);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axiosInstance.patch(`/session-types/${formData.id}`, formData);
      } else {
        await axiosInstance.post("/session-types", formData);
      }
      fetchSessionTypes();
      setIsOpen(false);
      setIsEdit(false);
      resetFormData();
    } catch (error) {
      console.error("Error saving session type:", error);
    }
  };

  const handleEdit = (sessionType: any) => {
    setFormData({
      id: sessionType.id,
      name: sessionType.name,
      duration: sessionType.duration,
      title: sessionType.title,
      sub: sessionType.sub,
      note: sessionType.note,
      fee: sessionType.fee,
    });
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/session-types/${id}`);
      fetchSessionTypes();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting session type:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      id: "",
      name: "",
      duration: "",
      title: "",
      sub: "",
      note: "",
      fee: "",
    });
  };

  const cardAccents = [
    { from: "from-teal-500", to: "to-cyan-400", icon: "bg-teal-100 text-teal-600", badge: "bg-teal-50 text-teal-700 border-teal-200" },
    { from: "from-violet-500", to: "to-purple-400", icon: "bg-violet-100 text-violet-600", badge: "bg-violet-50 text-violet-700 border-violet-200" },
    { from: "from-rose-500", to: "to-pink-400", icon: "bg-rose-100 text-rose-600", badge: "bg-rose-50 text-rose-700 border-rose-200" },
    { from: "from-amber-500", to: "to-orange-400", icon: "bg-amber-100 text-amber-600", badge: "bg-amber-50 text-amber-700 border-amber-200" },
    { from: "from-blue-500", to: "to-indigo-400", icon: "bg-blue-100 text-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  ];

  const formFields = [
    { id: "name", label: "Name", icon: <Tag className="w-3.5 h-3.5" />, placeholder: "e.g. single, couple", type: "text" },
    { id: "duration", label: "Duration (min)", icon: <Timer className="w-3.5 h-3.5" />, placeholder: "e.g. 50", type: "number" },
    { id: "title", label: "Title", icon: <FileText className="w-3.5 h-3.5" />, placeholder: "e.g. Individual Session", type: "text" },
    { id: "sub", label: "Subtitle", icon: <Layers className="w-3.5 h-3.5" />, placeholder: "e.g. 50 minutes · One-on-one therapy", type: "text" },
    { id: "note", label: "Note", icon: <MessageSquare className="w-3.5 h-3.5" />, placeholder: "Additional note for patients", type: "text" },
    { id: "fee", label: "Fee (₹)", icon: <IndianRupee className="w-3.5 h-3.5" />, placeholder: "e.g. 2500", type: "number" },
  ];

  return (
    <div className="min-h-screen  p-5 lg:p-7">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-200">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Session Types</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {sessionTypes.length} type{sessionTypes.length !== 1 ? "s" : ""} configured
            </p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => { setIsEdit(false); resetFormData(); setIsOpen(true); }}
              className="gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 h-10 text-sm font-semibold shadow-md shadow-teal-200 hover:shadow-teal-300 transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              Add Session Type
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {isEdit ? "Edit Session Type" : "New Session Type"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-3">
              {formFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label
                    htmlFor={field.id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    <span className="text-teal-500">{field.icon}</span>
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={(formData as any)[field.id]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="h-10 rounded-lg border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-teal-400/40 focus-visible:border-teal-400"
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => { setIsOpen(false); resetFormData(); }}
                className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 h-9 px-4 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-5 h-9 text-sm font-semibold shadow shadow-teal-200"
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Cards Grid ── */}
      {sessionTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
            <Layers className="w-8 h-8 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-slate-700">No session types yet</p>
            <p className="text-sm text-slate-400 mt-1">Create your first session type to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {sessionTypes.map((sessionType: any, idx: number) => {
            const accent = cardAccents[idx % cardAccents.length];
            return (
              <div
                key={sessionType.id}
                className="group relative bg-white rounded-2xl border border-slate-100 hover:border-teal-200 shadow-sm hover:shadow-lg hover:shadow-teal-50 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Color accent strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${accent.from} ${accent.to}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Top row: icon + name badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent.icon}`}>
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${accent.badge}`}>
                      {sessionType.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">
                    {sessionType.title}
                  </h3>

                  {/* Subtitle */}
                  {sessionType.sub && (
                    <p className="text-sm text-slate-500 mb-3">{sessionType.sub}</p>
                  )}

                  {/* Note */}
                  {sessionType.note && (
                    <div className="flex items-start gap-2 bg-slate-50 rounded-xl px-3 py-2.5 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 leading-relaxed">{sessionType.note}</p>
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mb-5 mt-auto">
                    <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-3 py-2 flex-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{sessionType.duration}</span>
                      <span className="text-xs text-slate-400">min</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-3 py-2 flex-1">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">
                        {Number(sessionType.fee).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sessionType)}
                      className="flex-1 h-9 gap-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>

                    {deleteConfirmId === sessionType.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <Button
                          size="sm"
                          onClick={() => handleDelete(sessionType.id)}
                          className="flex-1 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirmId(null)}
                          className="h-9 px-3 rounded-xl border-slate-200 text-slate-500 text-xs"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmId(sessionType.id)}
                        className="flex-1 h-9 gap-1.5 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionTypes;
