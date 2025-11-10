import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import SkillItem from "@/components/skill/SkillItem";

function SkillItemPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-96">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      }
    >
      <SkillItem />
    </Suspense>
  );
}

export default SkillItemPage;
