interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
            {description && (
              <p className="text-slate-600 text-lg mb-8">{description}</p>
            )}
            <div className="bg-slate-50 rounded-xl p-12">
              <div className="text-slate-400 text-6xl mb-4">🚧</div>
              <p className="text-slate-500 text-lg">
                This feature is coming soon!
              </p>
              <p className="text-slate-400 text-sm mt-2">
                We're working hard to bring you this amazing feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;