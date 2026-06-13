import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const samples = [
  ["Accountancy", "Partnership fundamentals", "Goodwill, profit-sharing ratio, and adjustment entries."],
  ["Economics", "Consumer equilibrium", "Utility, demand, and diagram cues for board answers."],
  ["Business Studies", "Principles of management", "Fayol and Taylor comparison notes."]
];

export default function SampleNotesPage() {
  return (
    <main className="container py-12">
      <h1 className="text-4xl font-black">Sample notes</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Public visitors can preview sample content. Full notes, bookmarks, scores, and planners require login.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {samples.map(([subject, title, text]) => (
          <Card key={title}>
            <CardHeader>
              <FileText className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="w-fit">
                {subject}
              </Badge>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
