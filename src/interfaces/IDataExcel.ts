import { Gender } from "./Enum";

export interface IDataEmployeeXlsx {
  STT: number;
  ["Họ và tên"]: string;
  ["Năm sinh"]: number;
  ["Giới tính"]: Gender;
  ["Địa chỉ"]: string;
  ["Số điện thoại"]: string;
}

export interface IDataEquipXlsx {
  STT: number;
  ["Mã số"]: string;
  ["Tên Thiết bị"]: string;
  ["Số lượng"]: number;
  ["Xuất xứ"]: string;
  ["Năm sản xuất"]: string;
  ["Ghi chú"]: string;
}

export interface IDataMonitoryXlsx {
  ["Ngày tháng"]: string;
  ["Địa điểm"]: string;
  ["Số bẫy x số đếm"]: number;
  ["Số chuột bẫy được"]: number;
  ["Ghi chú"]: string;
}

export interface IDataTrainingXlsx {
  ["Ngày, Tháng, Năm"]: string;
  ["Nội dung tập huấn/ đào tạo"]: string;
  ["Đơn vị tổ chức"]: string;
  ["Giảng viên tập huấn/đào tạo"]: string;
}
