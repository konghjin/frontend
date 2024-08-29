import api from "@/api/apiReferral";
import { autoLeftPad } from "@/utils/common";
import { changeLang } from "@/utils/language.js";

export default {
  namespaced: true,
  state() {
    return {
      modalState: false,
      exchange: {},
      exchangeFlag: "",
      // retri_id: "retri1",
      retri_id: "",
      session_id: "",
      uid: "",
      calenderDate: "",
      totalPages: 1,
      page: 1,
      per_page: 6,
      start_date: "",
      end_date: "",
      type: "",
      listLoading: false,
      isNotReferral: false,
      status: "",
      region_code: "",
      loginStatus: 200,
      setting: false,
      // res
      uidState: "",
      calenderInfo: [],
      monthlyInfo: {},
      profitInfo: {},
      paybackList: [],
      postStatus : 1,
    };
  },
  mutations: {
    changeModalState(state, payload) {
      state.modalState = payload;
      const body = document.querySelector("body");
      if (state.modalState === true) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    },
    selectExchange(state, payload) {
      state.exchange = {
        name: payload.name,
        logo: payload.logo,
        text: payload.text,
      };
    },
    setExchangeFlag(state) {
      switch (state.exchange.name) {
        case "OKX":
          state.exchangeFlag = 1;
          break;
        case "BingX":
          state.exchangeFlag = 2;
          break;
        case "Toobit":
          state.exchangeFlag = 3;
          break;
        case "Deepcoin":
          state.exchangeFlag = 4;
          break;
      }
    },
    setUId(state, payload) {
      state.uid = payload;
    },
    setCalenderDate(state, payload) {
      state.calenderDate = `${payload.year}${autoLeftPad(payload.month, 2)}`;
    },
    setReportDate(state, payload) {
      state.start_date = payload.start_date;
      state.end_date = payload.end_date;
    },
    setType(state, payload) {
      state.type = payload;
    },
    setPage(state, str) {
      if (str == "prev") {
        state.page--;
      } else if (str == "next") {
        state.page++;
      } else {
        state.page = 1;
      }
    },
    initSetting(state, payload) {
      state.setting = payload;
    },
    setLanugage(state,payload){
      state.region_code = payload;
    }
  },
  actions: {
    async getCheckApproval(context) {
      try {
        let retri_id = context.state.retri_id;
        let exchange = context.state.exchangeFlag;
        let response = await api.getCheckApprovalApi(retri_id,exchange);
        context.state.postStatus = response.status;
      } catch (error) {
        return;
      }
    },
    async postUid(context) {
      try {
        let info = {
          retri_id: context.state.retri_id,
          UID: context.state.uid,
          exchange: context.state.exchangeFlag,
          datetime: new Date().toISOString(),
        };
        let response = await api.postUidApi(info);
        if(response.recode === 0){
          context.state.uidState = 1; // msg 신청완료
        } else if (response.recode === 1){ 
          context.state.uidState = 4; // msg 중복
        } else if (response.recode === 2){
          context.state.uidState = 3; // msg 등록실패
        }
        // console.log(context.state.uidState);
      } catch (error) {
        return;
      }
    },
    async getMonthlyProfit(context) {
      try {
        let retri_id = context.state.retri_id;
        let response = await api.getMonthlyProfitApi(retri_id);
        if (response.status === 200) {
          context.state.monthlyInfo = response.data;
          context.state.monthlyInfo.monthly_data =
            response.data.monthly_data.reverse();
        }
      } catch (error) {
        context.state.monthlyInfo = {
          total_accumulated_profit: 0,
          monthly_data: [
            {
              total_profit: 0,
              month: "0000",
            },
          ],
        };
        return;
      }
    },
    async getCalendar(context) {
      try {
        let retri_id = context.state.retri_id;
        let year_month = context.state.calenderDate;
        let response = await api.getCalendarApi(retri_id, year_month);
        context.state.calenderInfo = response.result;
      } catch (error) {
        return;
      }
    },
    async getProfit(context) {
      try {
        let retri_id = context.state.retri_id;
        let response = await api.getProfitApi(retri_id);
        if (response.status === 500) {
          context.state.isNotReferral = true;
        } else {
          context.state.profitInfo = response.result[0];
        }
      } catch (error) {
        return;
      }
    },
    async getPaybackReport(context) {
      try {
        context.state.listLoading = true;
        let info = {
          retri_id: context.state.retri_id,
          page: context.state.page,
          per_page: context.state.per_page,
          start_date: context.state.start_date,
          end_date: context.state.end_date,
        };
        let type = context.state.type;
        let response = await api.getPaybackReportApi(info, type);
        context.state.paybackList = response.result;
        context.state.totalPages = response.pagination.total_pages;
        context.state.type = "";
        setTimeout(() => {
          context.state.listLoading = false;
        }, 200);
      } catch (error) {
        return;
      }
    },
    // async postRetriAuth(context) {
    //   try {
    //     let response = await api.postRetriAuthApi();
    //     context.state.status = response.status;
    //     //console.log(response.status);
    //   } catch (error) {
    //     return;
    //   }
    // },
    async getLoadUser(context) {
      try {
        // let response = await api.getLoadUserApi();

        let response = {
          "result": {
            "user_id": "retri60",
            "retri_id": "25576",
            "session_id": "882288638",
            "na_code": "KR"
          }
        }
        context.state.region_code = response.result.na_code;
        context.state.session_id = response.result.session_id;
        context.state.retri_id = response.result.retri_id;
        let lang = changeLang(context.state.region_code)
        localStorage.setItem("localeLangDisplayed", context.state.region_code);
        localStorage.setItem("localeLang", lang);

        //console.log(response);
      } catch (error) {
        return;
      }
    },
    async postCheckLogin(context) {
      try {
        // let info = {
        //   session_id: context.state.session_id,
        // };
        // console.log(context.state.session_id);
        // let response = await api.getCheckLoginApi();
        // context.state.loginStatus = response.status;
        //console.log(response);
        context
      } catch (error) {
        return;
      }
    },
  },
};
