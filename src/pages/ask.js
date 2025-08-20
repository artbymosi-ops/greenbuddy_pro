import Layout from "@/components/Layout";
import AIChat from "@/components/AIChat";

export default function AskPage(){
  return (
    <Layout>
      <AIChat seedPrompt="Warum werden die Blätter meiner Alokasie gelb?" />
    </Layout>
  );
}
