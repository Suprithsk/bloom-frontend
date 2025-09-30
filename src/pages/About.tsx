import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Lightbulb, Award } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      description: "Former tech executive with 15+ years in AI and product development.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      description: "AI researcher and engineer who previously led machine learning teams at major tech companies.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Elena Vasquez",
      role: "Head of Design",
      description: "Award-winning designer with expertise in creating intuitive user experiences.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We believe technology should empower people to achieve more, not replace human creativity."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We're constantly pushing boundaries to create solutions that didn't exist yesterday."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Our users are at the heart of everything we do. Their success is our success."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we build and deliver."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-sage opacity-30" />
          <div className="absolute top-10 right-10 w-32 h-32 bg-cobalt/20 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-sage/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <Badge variant="secondary" className="mb-6">About REPLACI</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Building the Future
              </span>
              <br />
              <span className="text-foreground">Together</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're a passionate team of innovators, designers, and engineers working to revolutionize 
              how people interact with technology.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  REPLACI was born from a simple observation: technology should enhance human potential, 
                  not complicate it. Our founders, frustrated with overcomplicated tools and fragmented 
                  workflows, set out to create something different.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  What started as a weekend project has grown into a revolutionary platform that's helping 
                  thousands of professionals streamline their work and unlock new possibilities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we're building the next generation of intelligent tools that understand context, 
                  adapt to your needs, and grow with your ambitions.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-sage rounded-2xl opacity-80" />
                <div className="absolute inset-4 bg-background rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-birch mb-2">2023</div>
                    <div className="text-muted-foreground">Founded</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-sage/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-sage" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind REPLACI
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="border-sage/20 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-square bg-gradient-sage opacity-80" />
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{member.name}</h3>
                    <div className="text-birch font-medium mb-3">{member.role}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Join Our Journey</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for innovation and excellence.
            </p>
            <div className="text-muted-foreground">
              Interested in working with us? Stay tuned for career opportunities coming soon.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;