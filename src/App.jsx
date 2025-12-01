import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TABS = {
  GALLERY: "gallery",
  REVIEWS: "reviews",
  PRICING: "pricing",
  ABOUT: "about",
  FAQ: "faq",
  AI: "ai",
};

const TAB_LABELS = {
  ru: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Обо мне",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеи",
  },
  uk: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Відгуки",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT]: "Про мене",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI ідеї",
  },
  kz: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Пікірлер",
    [TABS.PRICING]: "Бағалар",
    [TABS.ABOUT]: "Мен туралы",
    [TABS.FAQ]: "FAQ",
    [TABS.AI]: "AI идеялар",
  },
  by: {
    [TABS.GALLERY]: "Галерэя",
    [TABS.REVIEWS]: "Водгукі",
    [TABS.PRICING]: "Прайс",
    [TABS.ABOUT
