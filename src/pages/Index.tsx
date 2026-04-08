import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          🏔 TamgaFlow
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Цифровая платформа монетизации туристических Rest Points Кыргызстана
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by TOUROSAT AI — Sentinel-2 + SRTM + MODIS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">17</p>
            <p className="text-sm text-muted-foreground">Rest Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">$1.1B</p>
            <p className="text-sm text-muted-foreground">Туризм КР 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">95%</p>
            <p className="text-sm text-muted-foreground">Территории не монетизированы</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-foreground">88/7/5</p>
            <p className="text-sm text-muted-foreground">Split модель %</p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground">Как это работает</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/owner")}>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="text-4xl">🏠</div>
              <h3 className="text-lg font-bold text-foreground">1. Владелец</h3>
              <p className="text-sm text-muted-foreground">
                Описывает свой Rest Point → AI создаёт карточку с ценами на основе спутниковых данных
              </p>
              <Button variant="outline" className="w-full">Создать карточку →</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/tourist")}>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="text-4xl">🎒</div>
              <h3 className="text-lg font-bold text-foreground">2. Турист</h3>
              <p className="text-sm text-muted-foreground">
                Выбирает Rest Point и услуги → оплачивает → деньги делятся автоматически
              </p>
              <Button variant="outline" className="w-full">Оплатить услуги →</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard")}>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="text-4xl">📊</div>
              <h3 className="text-lg font-bold text-foreground">3. Фонд</h3>
              <p className="text-sm text-muted-foreground">
                Видит живой поток денег, AI рекомендации и принимает решения по грантам
              </p>
              <Button variant="outline" className="w-full">Открыть дашборд →</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-red-200">
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-lg font-bold text-red-600">❌ Проблема</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 95% дохода от туризма — в 5 популярных местах</li>
              <li>• Сёла не знают как привлечь туристов</li>
              <li>• Нет данных для принятия решений</li>
              <li>• Фонд не видит куда направлять гранты</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-lg font-bold text-green-600">✅ TamgaFlow решает</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• TOUROSAT AI оценивает каждую точку по спутнику</li>
              <li>• Автоматическое ценообразование и карточка</li>
              <li>• Прозрачный split: 88% владельцу, 7% платформе, 5% фонду</li>
              <li>• Живой дашборд с AI рекомендациями для Фонда</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-bold text-foreground">Team THREATUX</h2>
        <p className="text-muted-foreground">Tourism Revenue Hackathon 2025</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/owner")}>🏠 Владелец</Button>
          <Button onClick={() => navigate("/tourist")}>🎒 Турист</Button>
          <Button onClick={() => navigate("/dashboard")}>📊 Дашборд</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
