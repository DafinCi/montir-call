export default function manifest() {
  return {
    name: "MontirGO",
    short_name: "MontirGO",
    description:
      "AI-powered roadside assistance platform that connects nearby mechanics with customers through real-time service requests and live location tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "0F172A",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
