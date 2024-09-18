import type { Metadata } from 'next';

import HeroSection from '@/components/Home/HeroSection';
import NewsletterSignUp from '@/components/Home/NewsLetterSignUp';
import PopularbadmintonPlaces from '@/components/Home/PopularbadmintonPlaces';
import TopArticles from '@/components/Home/TopArticles';

// export async function generateMetadata(props: { params: { locale: string } }) {
//   const t = await getTranslations({
//     locale: props.params.locale,
//     namespace: "Index",
//   });

//   return {
//     title: t("meta_title"),
//     description: t("meta_description"),
//   };
// }

export const metadata: Metadata = {
  title: 'Pickleball',
};
export default function Index() {
  return (
    <div>
      <HeroSection />
      <PopularbadmintonPlaces />
      <TopArticles />
      <NewsletterSignUp />
    </div>
  );
}
