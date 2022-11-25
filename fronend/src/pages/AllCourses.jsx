import axios from "axios";
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toJalaali } from "../constants/unit";
import { useCourses } from "../hook/course";
import { useCurrentUser } from "../hook/currentUser";
import { useSemesters } from "../hook/semester";

function AllCourses() {
  const { data } = useCourses();

  const { data: semesters } = useSemesters();

  const { data: currentUser } = useCurrentUser();
  console.log(currentUser, "currentUser");

  const [state, setState] = useState({
    modal: false,
    name: "",
    modalInputName: "",
  });
  const access = localStorage.getItem("flag");

  const [values, setValus] = useState({
    major: "",
    className: "",
    masterName: "",
    unitCount: "",
    details: "",
    period: "",
    term: "",
    classStart: "",
    classEnd: "",
    classToday: "",
    classClock: "",
    minTerm: "",
    endTerm: "",
    price: "",
  });

  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({ name: state.modalInputName });
    modalClose();
    axios
      .post(
        "http://127.0.0.1:8000/api/share/courses/",
        {
          major_id: Number(values.major),

          semester_id: Number(values.term),
          name: values.className,
          details: values.details,
          unit: values.unitCount,
          master_id: Number(values.masterName),

          schedules: [
            {
              day: values.classToday,
              time: values.classClock,
            },
          ],
          midterm_exam_date: values.minTerm,
          final_exam_date: values.endTerm,
          price: values.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2NTYxNjQ4LCJqdGkiOiIzNzkzNWM1MmQ4Mzg0NjQ2OTdlNmE0NWYwNGEwYzI4NyIsInVzZXJfaWQiOjN9.EJuZ4h5fwzNcl5A0swmhqUprfTvzHT1Ctv_BnJYLokg`,

            "X-CSRFToken":
              "mv5bfbYlTG38dX0YQWAT4iCJEl1kFoBLexah2DkqWzMatZ0bEqIstNIH0gRfXc2g",
          },
        }
      )
      .then((result) => {
        alert(result.status.toString());
      })
      .catch((error) => {
        alert(error);
      });
  };

  const modalOpen = () => {
    setState({ modal: true });
  };

  const modalClose = () => {
    setState({
      modalInputName: "",
      modal: false,
    });
  };
  console.log(
    data.map((row, i) => row.schedules),
    "sdasdas"
  );

  return access === "true" ? (
    <>
      <table class="table !text-right   mt-3">
        <thead className="bg-slate-500">
          <tr>
            <th class="col  !text-right !w-20 ">{" قیمت"}</th>
            <th class="col !text-right !w-20">{"    امتحان پایان ترم"}</th>
            <th class="col !text-right !w-20">{"    امتحان میانترم"}</th>
            <th class="col !text-right !w-20">{"   ساعت کلاس"}</th>
            <th class="col !text-right !w-24">{"   روز کلاس"}</th>
            <th class="col !text-right !w-20 ">{"   اتمام کلاس"}</th>
            <th class="col !text-right !w-20">{"   شروع کلاس"}</th>
            <th class="col !text-right !w-14">{"   ترم"}</th>
            <th class="col !text-right !w-24">{"   دوره"}</th>
            <th class="col !text-right  !w-20">{"  تعداد واحد"}</th>
            <th class="col !text-right  !w-16">{" نام استاد"}</th>
            <th class="col  !text-right !pr-8 !w-20">{" نام کلاس"}</th>
          </tr>
        </thead>
      </table>
      <table id="myTable" class="table !text-right   table-striped table-dark ">
        <tbody>
          {data.map((row, i) => (
            <>
              <tr>
                {location.pathname !== "/master" ? "" : ""}

                <td class="  !text-right   !w-20  ">
                  {row.price.toLocaleString()}
                </td>
                <td class="  !text-right !w-24 !pr-5 ">
                  {toJalaali(row.final_exam_date)}
                </td>
                <td class="  !text-right !w-20 !pr-4 ">
                  {toJalaali(row.midterm_exam_date)}
                </td>
                <td class="  !text-right !w-20 ">
                  {row.schedules.map((i, k) => i.time)}
                </td>
                <td class="  !text-right !w-24  !pr-8 ">
                  {row.schedules.map((i, k) =>
                    i.day === "SUNDAY"
                      ? "یکشنبه"
                      : "SARURDAY"
                      ? "شنبه"
                      : "MONDAY"
                      ? "دوشنبه"
                      : "TUESDAY"
                      ? "سه شنبه"
                      : "WEDNESDAY"
                      ? "چهار شنبه"
                      : "THURSDAY"
                      ? "پنج شنبه"
                      : "جمعه"
                  )}
                </td>
                <td class="  !text-right !w-20 !pr-5 ">
                  {toJalaali(row.semester.end_date)}
                </td>
                <td class="  !text-right !w-20 ">
                  {toJalaali(row.semester.start_date)}
                </td>
                <td class="  !text-right  !w-14 ">{row.semester.name}</td>
                <td class="  !text-right !pr-5 !w-20 ">
                  {row.major.degree === "BACHELOR" ? "لیسانس" : "فوق لیسانی"}
                </td>
                <td class="  !text-right  !w-16 ">{row.unit}</td>
                <td class="  !text-right !w-16 ">{row.master.first_name}</td>
                <td class="  !text-right !pr-8 !w-20 ">{row.name}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  ) : (
    <div>لطفا لاگ ین کنید اول</div>
  );
}

export default AllCourses;
