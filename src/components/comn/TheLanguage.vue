<template>
    <!--언어설정 드롭다운메뉴:start-->
    <div class="right_setBox">
      <div class="selectBox" @click="isClickLang = !isClickLang">
        <input
          type="text"
          id="globalVal"
          name="globalVal"
          readonly
          v-model="selectLang"
        />
      </div>
      <transition name="fade">
        <div class="drowdown_box" v-if="isClickLang">
          <ul class="option">
            <li v-for="option in langArr" :key="option">
              <a
                :id="`globalChk_${option}`"
                @click="choiceLang($i18n, option)"
                :value="option.displayed"
                :name="`globalChk_${option}`"
                :class="{ selected: selectLang === option.displayed }"
                >{{ option.displayed }}
              </a>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <!--언어설정 드롭다운메뉴:End-->
  </template>
  
  <script setup>
  import { ref } from "vue";
import { useStore } from "vuex";
  const store = useStore();
  /**
   * 언어선택탭 컴포넌트
   * @isClickLang 클릭시 드랍다운메뉴 open
   * @langArr 드랍다운메뉴 언어배열
   * @selectLang 선택한 언어 display (localStorage 값 가져오기)
   * @choiceLang 선택한 언어로 변경 및 localStorage set 함수
   */

  let isClickLang = ref(false);
  let langArr = ref([
    {
      abbr : "en",
      displayed : "EN",
    },
    {
      abbr : "ko",
      displayed : "KR",
    },
    {
      abbr : "zh",
      displayed : "CN",
    },
    {
      abbr : "ja",
      displayed : "JP",
    },
    {
      abbr : "vi",
      displayed : "VN",
    }
  ]);
  
  let selectLang = ref(localStorage.getItem("localeLangDisplayed"));
  
  const choiceLang = ($i18n, selectLanguage) => {
    selectLang.value = selectLanguage.displayed;
    localStorage.setItem("localeLang", selectLanguage.abbr);
    localStorage.setItem("localeLangDisplayed", selectLanguage.displayed);
    isClickLang.value = false;
    $i18n.locale = selectLanguage.abbr;
    store.commit("referral/setLanugage",selectLanguage.displayed);
  };
  
  //created;
  if (!selectLang.value) {
    selectLang.value = localStorage.getItem("localeLangDisplayed");
  }
  store.commit("referral/setLanugage", localStorage.getItem("localeLangDisplayed"));
  </script>
  