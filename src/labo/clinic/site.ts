import { PRACTICE } from "@/labo/content";

/**
 * The clinic's contact, hours, locations and booking — carried over from the
 * Skin Haven Cosmetic Clinic site on Nov 18 2026 (Javier: "make TLM like the
 * site was with same content and photos"). The phone line, the two addresses,
 * the Vagaro scheduler and the shop link are the clinic's existing ones; the
 * email is the practice's own. Change any of them here only.
 */
export const CLINIC_SITE = {
  phoneDisplay: "877-756-4286",
  phoneNumber: "877-756-4286",
  tel: "tel:877-756-4286",
  sms: "sms:877-756-4286",
  email: PRACTICE.email,
  instagram: "https://www.instagram.com/skinhavenclinic.com/",
  shopUrl: "https://connect.skinbetter.com/skinhavenclinic",
  queenBeeUrl: "https://www.queenbeesalonspa.com/",
  promo: "New patients receive $20 off their first aesthetic treatment",
  hours: [
    { days: "Monday – Friday", time: "10:00 am – 6:00 pm" },
    { days: "Saturday – Sunday", time: "By appointment only" },
  ],
  locations: [
    {
      id: "south-lake-union",
      name: "South Lake Union",
      cityLabel: "Seattle",
      address1: "910 Lenora Street, Suite #152",
      address2: "Seattle, WA 98121",
      mapUrl: "https://goo.gl/maps/yxReKvsQTcTbRbRb6",
      mapEmbed:
        "https://maps.google.com/maps?q=910%20Lenora%20St%20Suite%20152%2C%20Seattle%2C%20WA%2098121%2C%20USA&t=m&z=15&output=embed&iwloc=near",
      note: "Inside Queen Bee Salon and Spa, above Whole Foods Market, near Westlake Avenue and Denny Way. Free 30-minute parking in the courtyard, or the garage below at 2200 Westlake.",
      contactNote: "Text or phone",
      bookOnline: true,
    },
    {
      id: "ruston",
      name: "Ruston",
      cityLabel: "Ruston",
      address1: "5013 N Pearl St B",
      address2: "Ruston, WA 98407",
      mapUrl: "https://maps.app.goo.gl/bieatayJr3Xhf4xQ7",
      mapEmbed:
        "https://maps.google.com/maps?q=5013%20N%20Pearl%20St%20B%2C%20Ruston%2C%20WA%2098407%2C%20USA&t=m&z=15&output=embed&iwloc=near",
      note: "By appointment only.",
      contactNote: "Text only",
      bookOnline: false,
    },
  ],
  vagaroWidgetUrl:
    "https://www.vagaro.com/resources/WidgetEmbeddedLoader/OZqpCJGtCZ4cT3qmV35y6JuPlXez3avV34mC2PeFJ4mC30m9cyUeJUtjP0dDxkJEvwRapWUgZawifCs7fYJEPwMc8?v=Uj4mVvhz7Z8pr6yeqwrOrYNN20RSgaH266vQGLysy67m",
} as const;

export type ClinicLocation = (typeof CLINIC_SITE.locations)[number];
