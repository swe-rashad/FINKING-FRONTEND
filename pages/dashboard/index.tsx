export async function getStaticProps() {
  return {
    redirect: {
      destination: '/dashboard/statistics',
      permanent: false,
    },
  };
}

export default function DashboardIndex() {
  return null;
}
