import React from 'react'
import Landinglayout from "../../../components/landingLayout/index"
import axios from 'axios';
import { apiUrl } from '../../../../environment';
import { slugify } from '@/components/slugify';
import NewsDetails from "../../../components/news-DetailsDesign/index"

// ✅ ISR: re-generate page every 60 seconds
export const revalidate = 60; // seconds

export async function generateStaticParams() {
  const res = await axios.get(`${apiUrl}/news/getAllNews`);
  const allnews = res.data?.data || [];

  return allnews.map((b) => ({
    slug: slugify(b.title),
  }));
}

// ✅ Fetch data for each page
async function getSingleNews(slug) {
  const res = await axios.get(`${apiUrl}/news/getAllNews`);
  const allnews = res.data?.data || [];
    const data = allnews.find(
    (b) => slugify(b.title) === slug
  );
  // console.log("data",data)
  const singlenews = slug

  return data || null;
}

// ✅ Page component (can be async)
const Page = async ({ params }) => {    
  const { slug } = params;
  const singlenews =await getSingleNews(slug)
    // console.log("singlenews",singlenews)
  if (!singlenews) {
    return (
      <Landinglayout>
        <div className="text-center py-10 text-gray-500">News not found</div>
      </Landinglayout>
    );
  }

  return (
    <Landinglayout>
      <div className="">
        <NewsDetails info={singlenews}/>
          </div>
    </Landinglayout>
  );
};

export default Page;