import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect } from "react";



import {
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Save,
  X,
  Upload,
  FileText,
  Briefcase,
  Building2,
  IdCard,
} from "lucide-react";

export default function Profile() {
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState({});
  const [edit, setEdit] = useState(false);

  // const [showPersonal, setShowPersonal] = useState(false);
  // const [showEmployment, setShowEmployment] = useState(false);

  const [activeSection, setActiveSection] = useState("personal");
  // "personal" | "employment"



  const documents = [];


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");

        // backend se { employee, profile } aa raha hai
        setEmployee(res.data.employee);
        setData({
          ...res.data.employee,
          ...res.data.profile,
        });
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };

    fetchProfile();
  }, []);



  // SAMPLE DOCUMENTS
  const handleSave = async () => {
    try {
      await axiosInstance.post("/profile/me", data);
      setEdit(false);
    } catch (err) {
      console.error("Save profile error", err);
      alert("Profile save failed");
    }
  };



  // 🔒 SAFETY CHECK
  if (!employee) {
    return <p className="p-6">Loading profile...</p>;
  }


  return (
    <div className="min-h-screen bg-blue-50 w-full overflow-x-hidden">


      <div className="flex">
        {/* <Sidebar /> */}

        <main className="flex-1 p-6 min-w-0">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <User size={22} /> My Profile
            </h1>

            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                <Pencil size={16} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  <Save size={16} /> Save
                </button>

                <button
                  onClick={() => setEdit(false)}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-md text-sm"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* PROFILE CARD */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="grid grid-cols-12 gap-8">
              {/* LEFT */}
              <div className="col-span-12 md:col-span-3">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <img
                    src="https://i.pravatar.cc/200?img=12"
                    className="w-28 h-28 rounded-full mx-auto mb-3"
                  />

                  <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full mb-3">
                    <Upload size={16} /> Update Photo
                  </button>

                  {/* 🔥 NEW BUTTONS */}
                  <div className="space-y-2 mt-8">
                    <button
                      onClick={() => setActiveSection("personal")}
                      className={`w-full text-sm py-2 rounded-md 
                      ${activeSection === "personal"
                          ? "bg-gray-200 text-black"
                          : "bg-white hover:bg-gray-100"}`}
                    >
                      Personal Details
                    </button>

                    <button
                      onClick={() => setActiveSection("employment")}
                      className={`w-full text-sm py-2 rounded-md mt-2
                      ${activeSection === "employment"
                          ? "bg-gray-200 text-black"
                          : "bg-white hover:bg-gray-100"}`}
                    >
                      Employment Details
                    </button>

                  </div>
                </div>

              </div>

              {/* RIGHT */}
              <div className="col-span-12 md:col-span-9">
                {/* PERSONAL DETAILS */}
                {activeSection === "personal" && (
                  <Section title="Personal Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Full Name" value={data.name} edit={edit}
                        onChange={(v) => setData({ ...data, name: v })} />
                      <Field label="Email" value={data.email} edit={edit}
                        onChange={(v) => setData({ ...data, email: v })}
                      />

                      <Field label="Phone Number" value={data.phone} edit={edit}
                        onChange={(v) => setData({ ...data, phone: v })}
                      />

                      <Field label="Mother's Name" value={data.motherName} edit={edit}
                        onChange={(v) => setData({ ...data, motherName: v })} />
                      <Field label="Father's Name" value={data.fatherName} edit={edit}
                        onChange={(v) => setData({ ...data, fatherName: v })} />
                      <Field label="Date of Birth" value={data.dob} edit={edit}
                        onChange={(v) => setData({ ...data, dob: v })} />
                      <Field label="Gender" value={data.gender} edit={edit}
                        onChange={(v) => setData({ ...data, gender: v })} />
                      <Field label="Marital Status" value={data.maritalStatus} edit={edit}
                        onChange={(v) => setData({ ...data, maritalStatus: v })} />
                      <Field label="Contact Number" value={data.phone} edit={edit}
                        onChange={(v) => setData({ ...data, phone: v })} />
                      <Field label="Address" value={data.address} edit={edit}
                        onChange={(v) => setData({ ...data, address: v })} />
                      <Field label="City" value={data.city} edit={edit}
                        onChange={(v) => setData({ ...data, city: v })} />
                      <Field label="Pincode" value={data.pincode} edit={edit}
                        onChange={(v) => setData({ ...data, pincode: v })} />
                      <Field label="State" value={data.state} edit={edit}
                        onChange={(v) => setData({ ...data, state: v })} />
                      <Field label="Nationality" value={data.nationality} edit={edit}
                        onChange={(v) => setData({ ...data, nationality: v })} />
                    </div>
                  </Section>
                )}


                {/* EMPLOYMENT DETAILS */}
                {activeSection === "employment" && (
                  <Section title="Employment Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <Static label="Designation" value={employee.designation} />
                      <Static label="Department" value={employee.department?.name} />
                      <Static label="Joining Date" value={employee.joiningDate} />
                      <Static label="Employment Type" value={employee.employmentType} />
                      <Static label="Status" value={employee.status} />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <FileText size={18} /> Employee Documents
                      </h2>
                      <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                        <Upload size={16} /> Add Document
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {documents.length === 0 ? (
                        <p className="text-sm text-gray-500 col-span-full">
                          No documents uploaded
                        </p>
                      ) : (
                        documents.map((doc, i) => (
                          <div key={i} className="border rounded-lg p-4 text-sm">
                            <p className="font-medium mb-1">{doc.title}</p>
                            <p className="text-gray-500">{doc.file}</p>
                            {doc.size && (
                              <p className="text-xs text-gray-400 mt-1">{doc.size}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </Section>



                )}


                {/* COMPANY DETAILS */}
                {/* <Section title="Employment Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Static label="Designation" value={employee.designation} icon={<Briefcase size={14} />} />
                    <Static label="Joining Date" value={employee.joiningDate} icon={<Calendar size={14} />} />
                    <Static label="Department" value={employee.department?.name} icon={<Building2 size={14} />} />
                  </div>
                </Section> */}

                {/* DOCUMENTS */}
                {/* <div className="bg-white rounded-xl shadow p-6"> */}
                {/* <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <FileText size={18} /> Employee Documents
                  </h2>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                    <Upload size={16} /> Add Document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {documents.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-full">
                      No documents uploaded
                    </p>
                  ) : (
                    documents.map((doc, i) => (
                      <div key={i} className="border rounded-lg p-4 text-sm">
                        <p className="font-medium mb-1">{doc.title}</p>
                        <p className="text-gray-500">{doc.file}</p>
                        {doc.size && (
                          <p className="text-xs text-gray-400 mt-1">{doc.size}</p>
                        )}
                      </div>
                    ))
                  )}
                </div> */}
                {/* </div> */}

              </div>
            </div>
          </div>

          {/* ================= PERSONAL DETAILS MODAL ================= */}
          {/* {showPersonal && (
            <Modal
              title="Personal Details"
              onClose={() => setShowPersonal(false)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Static label="Full Name" value={data.name} />
                <Static label="Email" value={data.email} />
                <Static label="Phone" value={data.phone} />
                <Static label="Father Name" value={data.fatherName} />
                <Static label="Mother Name" value={data.motherName} />
                <Static label="Date of Birth" value={data.dob} />
                <Static label="Gender" value={data.gender} />
                <Static label="Marital Status" value={data.maritalStatus} />
                <Static label="Address" value={data.address} />
                <Static label="City" value={data.city} />
                <Static label="Pincode" value={data.pincode} />
                <Static label="State" value={data.state} />
                <Static label="Nationality" value={data.nationality} />
              </div>
            </Modal>
          )} */}

          {/* ================= EMPLOYMENT DETAILS MODAL ================= */}
          {/* {showEmployment && (
            <Modal
              title="Employment Details"
              onClose={() => setShowEmployment(false)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Static label="Designation" value={employee.designation} />
                <Static label="Department" value={employee.department?.name} />
                <Static label="Joining Date" value={employee.joiningDate} />
                <Static label="Employment Type" value={employee.employmentType} />
                <Static label="Status" value={employee.status} />
              </div>
            </Modal>
          )} */}
        </main>
      </div>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-blue-600 mb-4">{title}</h3>
      {children}
    </div>
  );
}


function Field({ label, value, edit, onChange }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      {!edit ? (
        <p className="font-medium">{value}</p>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}

function Static({ label, value, icon }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1 flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}

