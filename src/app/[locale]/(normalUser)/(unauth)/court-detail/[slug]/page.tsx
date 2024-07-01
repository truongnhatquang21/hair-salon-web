import CourtDetail from "@/components/CourtDetail/CourtDetail";

type CourtDetailProps = {
  params: { slug: string; locale: string };
};
const CourtDetailPage = (props: CourtDetailProps) => {
  return <CourtDetail id={props.params.slug} />;
};

export default CourtDetailPage;
