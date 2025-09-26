import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Clock, 
  Star,
  Award,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  Users,
  CheckCircle,
  Lock
} from 'lucide-react';

interface EducationProps {
  user: any;
}

export function Education({ user }: EducationProps) {
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    {
      id: 'basics',
      title: 'Investment Basics for Beginners',
      description: 'Learn fundamental investment concepts, risk management, and portfolio building',
      duration: '2 hours',
      lessons: 8,
      difficulty: 'Beginner',
      rating: 4.8,
      students: 2847,
      completed: completedCourses.includes('basics'),
      topics: ['What is Investing?', 'Risk vs Return', 'Diversification', 'Getting Started'],
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green'
    },
    {
      id: 'african-markets',
      title: 'Understanding African Markets',
      description: 'Deep dive into African stock exchanges, bonds, and regional investment opportunities',
      duration: '3 hours',
      lessons: 12,
      difficulty: 'Intermediate',
      rating: 4.9,
      students: 1523,
      completed: completedCourses.includes('african-markets'),
      topics: ['Nigerian Stock Exchange', 'Kenyan Markets', 'South African JSE', 'Regional Bonds'],
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'blue'
    },
    {
      id: 'risk-management',
      title: 'Risk Management Strategies',
      description: 'Master the art of protecting your investments while maximizing returns',
      duration: '2.5 hours',
      lessons: 10,
      difficulty: 'Intermediate',
      rating: 4.7,
      students: 1829,
      completed: completedCourses.includes('risk-management'),
      topics: ['Risk Assessment', 'Stop Losses', 'Hedging', 'Portfolio Protection'],
      icon: <Shield className="h-6 w-6" />,
      color: 'purple'
    },
    {
      id: 'advanced-strategies',
      title: 'Advanced Investment Strategies',
      description: 'Learn complex strategies used by professional investors and fund managers',
      duration: '4 hours',
      lessons: 15,
      difficulty: 'Advanced',
      rating: 4.6,
      students: 891,
      completed: false,
      locked: !completedCourses.includes('basics'),
      topics: ['Options Trading', 'Derivatives', 'Alternative Investments', 'Tax Optimization'],
      icon: <Target className="h-6 w-6" />,
      color: 'red'
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'How to Set Your First Investment Goal',
      description: 'Step-by-step guide to defining realistic investment objectives',
      duration: '8 min',
      type: 'video',
      category: 'Getting Started',
      thumbnail: '🎯'
    },
    {
      id: 2,
      title: 'Reading Nigerian Bond Certificates',
      description: 'Understand the key information in government bond documents',
      duration: '12 min',
      type: 'video',
      category: 'Bonds',
      thumbnail: '📜'
    },
    {
      id: 3,
      title: 'Diversification Made Simple',
      description: 'Learn how to spread risk across different investment types',
      duration: '15 min',
      type: 'interactive',
      category: 'Portfolio',
      thumbnail: '📊'
    },
    {
      id: 4,
      title: 'Market Analysis Tools for Beginners',
      description: 'Free tools and resources to analyze African markets',
      duration: '20 min',
      type: 'article',
      category: 'Analysis',
      thumbnail: '🔍'
    }
  ];

  const financialTerms = [
    { term: 'Asset Allocation', definition: 'The process of dividing investments among different asset categories like stocks, bonds, and cash.' },
    { term: 'Yield', definition: 'The income return on an investment, typically expressed as an annual percentage.' },
    { term: 'Market Capitalization', definition: 'The total value of a company\'s shares in the stock market.' },
    { term: 'Liquidity', definition: 'How easily an investment can be converted to cash without affecting its market price.' },
    { term: 'Volatility', definition: 'The degree of variation in an investment\'s price over time.' },
    { term: 'Bull Market', definition: 'A period of rising stock prices and optimistic investor sentiment.' },
    { term: 'Bear Market', definition: 'A period of declining stock prices, typically 20% or more from recent highs.' },
    { term: 'Dividend', definition: 'A payment made by companies to shareholders from their profits.' }
  ];

  const achievements = [
    { name: 'First Course Complete', description: 'Completed your first educational course', earned: completedCourses.length > 0 },
    { name: 'Knowledge Seeker', description: 'Completed 3 courses', earned: completedCourses.length >= 3 },
    { name: 'Investment Scholar', description: 'Completed all beginner courses', earned: false },
    { name: 'Community Educator', description: 'Helped 10 other users', earned: false }
  ];

  const startCourse = (courseId: string) => {
    if (!completedCourses.includes(courseId)) {
      setCompletedCourses([...completedCourses, courseId]);
      // In a real app, this would track actual progress
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      green: 'text-green-600 bg-green-50 border-green-200',
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      red: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="space-y-6">
      {/* Education Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-blue-700 flex items-center justify-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span>Financial Education Hub</span>
          </CardTitle>
          <CardDescription className="text-blue-600">
            Master investing with courses designed for African markets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-700">{completedCourses.length}</div>
              <div className="text-sm text-blue-600">Courses Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {completedCourses.length * 2.5}h
              </div>
              <div className="text-sm text-green-600">Time Learned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {achievements.filter(a => a.earned).length}
              </div>
              <div className="text-sm text-purple-600">Achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">Gold</div>
              <div className="text-sm text-orange-600">Learning Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          <TabsTrigger value="courses" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="glossary" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Glossary</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className={`${getColorClasses(course.color)} border-2`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${getColorClasses(course.color)} border`}>
                      {course.icon}
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                      {course.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                      {course.locked && (
                        <Badge className="bg-gray-100 text-gray-600">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-gray-900">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </span>
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">What you'll learn:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {course.topics.map((topic, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </span>
                    <Button
                      onClick={() => startCourse(course.id)}
                      disabled={course.locked}
                      className={`${
                        course.completed 
                          ? 'bg-gray-600 hover:bg-gray-700' 
                          : `bg-${course.color}-600 hover:bg-${course.color}-700`
                      }`}
                    >
                      {course.locked ? 'Locked' : course.completed ? 'Review' : 'Start Course'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{tutorial.thumbnail}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {tutorial.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tutorial.type}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{tutorial.duration}</span>
                        </span>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Glossary Tab */}
        <TabsContent value="glossary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Terms Dictionary</CardTitle>
              <CardDescription>Essential terms every investor should know</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialTerms.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-2">{item.term}</h4>
                    <p className="text-sm text-gray-600">{item.definition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((completedCourses.length / courses.length) * 100)}%
                    </span>
                  </div>
                  <Progress value={(completedCourses.length / courses.length) * 100} className="h-2" />
                </div>
                
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        course.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-900">{course.title}</span>
                    </div>
                    <Badge className={course.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                      {course.completed ? 'Complete' : 'Not Started'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {achievement.earned ? (
                        <Award className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Award className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                      }`}>
                        {achievement.name}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}