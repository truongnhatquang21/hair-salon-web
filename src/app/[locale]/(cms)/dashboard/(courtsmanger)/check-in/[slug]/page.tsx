import CheckinDetail from "@/views/checkin/CheckinDetail";

const page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  return <CheckinDetail slug={slug} />;
};

export default page;
