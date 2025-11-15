import ExerciseResult from "@/components/exercise/ExerciseResult";

async function ExerciseResultPage({
  params,
}: {
  params: Promise<{ id: string; exercisesId: string }>;
}) {
  const { id, exercisesId } = await params;

  return <ExerciseResult skillId={id} exerciseId={exercisesId} />;
}

export default ExerciseResultPage;
