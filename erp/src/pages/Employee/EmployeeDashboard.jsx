import Tasks from "../../components/Tasks";
import Attendance from "../../components/Attendance";
import LeaveStatus from "../../components/LeaveStatus";
import Announcements from "../../components/Announcements";
import Payslip from "../../components/Payslip";
import StatsCards from "../../components/StatsCards";


export default function EmployeeDashboard() {
  return (
      <div className="flex-1 w-full max-w-full overflow-x-hidden">

        <div className="flex">
      {/* <Sidebar /> */}

        <div className="p-6 grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <StatsCards />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Tasks />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Attendance />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <LeaveStatus />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Announcements />
          </div>

          {/* <div className="col-span-12 lg:col-span-3">
            <Payslip />
          </div> */}
        </div>
      </div>
    </div>
  );
}
