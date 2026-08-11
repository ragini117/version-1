import React from "react";
import LandingLayout from "../../../../components/landingLayout/index";
import BlogDetailsSection from "../../../../components/blogDetailsDesign/index";
import { apiUrl } from "../../../../../environment";
import { strippedString, truncate } from "string-utility-ts";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const slugString = Array.isArray(slug) ? slug.join("-") : slug;
  const blogId = slugString.split("-").pop();

  if (!blogId) return {};

  try {
    const res = await fetch(`${apiUrl}/blog/get/${blogId}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const info = data.findBlog;

    if (!info) return {};

    const desc = truncate(strippedString(info.description || ""), 500) || "";

    return {
      title: info.title,
      description: desc,
      openGraph: {
        title: info.title,
        description: desc,
        images: [
          {
            url: `${apiUrl}/asset/getImages?pathName=BLOGS_IMAGE&imageName=${info?.imageUrl}`,
            alt: info.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating blog metadata:", error);
    return {};
  }
}

const page = () => {
  return (
    <div>
      <LandingLayout footer>
        <BlogDetailsSection />
      </LandingLayout>
    </div>
  );
};

export default page;