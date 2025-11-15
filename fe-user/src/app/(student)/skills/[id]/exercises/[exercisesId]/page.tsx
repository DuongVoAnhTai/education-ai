import ExerciseTaking from "@/components/exercise/ExerciseTaking";

async function ExerciseQuestion({
  params,
}: {
  params: Promise<{ id: string; exercisesId: string }>;
}) {
  const { id, exercisesId } = await params;

  return <ExerciseTaking skillId={id} exerciseId={exercisesId} />;
}

export default ExerciseQuestion;
