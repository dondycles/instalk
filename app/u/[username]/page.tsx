export default function UserPage({ params }: { params: { username: string } }) {
  return params.username;
}
