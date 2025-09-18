export const InitialAvatar = ({ name, className }) => {
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";

    const names = name.split(" ");
    const firstName = names[0] || "";
    const lastName = names.length > 1 ? names[names.length - 1] : "";

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
