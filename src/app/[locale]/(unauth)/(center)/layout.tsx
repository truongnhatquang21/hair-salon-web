export default function CenteredLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">
      {props.children}
    </div>
  );
}
