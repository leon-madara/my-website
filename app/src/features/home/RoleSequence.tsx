import { MorphingText } from "../../shared/MorphingText";

const roles = [
  "Full Stack AI Developer & Designer",
  "AI Integration Engineer",
  "Web Developer & Designer",
  "Visual Designer"
];

export function RoleSequence() {
  return (
    <MorphingText
      as="h2"
      className="role kenyan-gradient role-sequence"
      tabIndex={0}
      texts={roles}
    />
  );
}
