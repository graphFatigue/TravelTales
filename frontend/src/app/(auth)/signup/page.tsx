import { Metadata } from 'next';
import SignUpForm from './SignUpForm';

export const metadata: Metadata = {
  title: 'Log in',
};

export default function page() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}
