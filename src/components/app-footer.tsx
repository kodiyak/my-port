import SocialLinks from "./social-links";

export default function AppFooter() {
  return (
    <div className="border-t border-dashed">
      <div className="mx-auto w-full max-w-xl border-x border-dashed">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start gap-2 px-6 py-4">
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
