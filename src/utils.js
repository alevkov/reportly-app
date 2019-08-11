  export default function convertDateToSimpleFormat(date) {
    return date.toString().split(" ").slice(1, 4).join(" ");
  }