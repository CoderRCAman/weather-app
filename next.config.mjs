/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPEN_DATA_BASE_API:
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records",
  },
  reactStrictMode: false,
};

export default nextConfig;
